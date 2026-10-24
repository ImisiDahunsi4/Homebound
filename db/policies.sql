-- ============================================================================
-- HomeBound — Row-Level Security Intent
-- ----------------------------------------------------------------------------
-- Schema-only repo: these policies document the intended access matrix from
-- 05-security-privacy.md / 16-entity-permissions.md. They assume a Postgres
-- auth context function auth.uid() (Supabase-style). Adjust to whatever auth
-- provider is wired later. NOTHING here is enforced until a live DB exists.
--
-- Defaults: deny-by-default on private entities. A missing rule = no access.
-- The service role bypasses RLS and must only run inside narrowly scoped
-- backend functions after explicit authorization checks.
-- ============================================================================

ALTER TABLE profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_reports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_cases            ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_photos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sightings               ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_candidates        ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE reunion_verifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events            ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_assignments   ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- profiles: read/update own row's safe fields; role changes server-only.
-- ---------------------------------------------------------------------------
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY profiles_update_own_safe ON profiles
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
-- NOTE: role / role_approved_at must additionally be blocked via column-level
-- REVOKE UPDATE or a trigger, since RLS alone can't restrict columns.

-- ---------------------------------------------------------------------------
-- pet_reports: owner-only private rows. Writes go through backend functions
-- (publishReport / updateOwnedReport) — direct inserts are denied to members.
-- ---------------------------------------------------------------------------
CREATE POLICY pet_reports_select_own ON pet_reports
  FOR SELECT USING (owner_user_id = auth.uid());
CREATE POLICY pet_reports_update_own ON pet_reports
  FOR UPDATE USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());
CREATE POLICY pet_reports_delete_own_draft ON pet_reports
  FOR DELETE USING (owner_user_id = auth.uid() AND status = 'draft');
-- Server-forbidden fields (owner_user_id, status, public_*, version,
-- published_at, closed_at) are protected in the backend function layer.

-- ---------------------------------------------------------------------------
-- public_cases: the only anonymous-readable case data. No client writes.
-- ---------------------------------------------------------------------------
CREATE POLICY public_cases_public_read ON public_cases
  FOR SELECT USING (true);
-- Writes happen only via the projection service role.

-- ---------------------------------------------------------------------------
-- report_photos: owner + staff need-to-know. Public sees only approved URLs
-- exposed through public_cases.primary_image_public_url.
-- ---------------------------------------------------------------------------
CREATE POLICY report_photos_owner ON report_photos
  FOR ALL USING (owner_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- sightings: create when authenticated; read own + (case owner via backend).
-- ---------------------------------------------------------------------------
CREATE POLICY sightings_insert_auth ON sightings
  FOR INSERT WITH CHECK (submitted_by_user_id = auth.uid());
CREATE POLICY sightings_select_own ON sightings
  FOR SELECT USING (submitted_by_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- match_candidates / match_reviews / reunion_verifications:
-- participants & assigned staff only, via backend-scoped functions.
-- ---------------------------------------------------------------------------
CREATE POLICY match_candidates_participant_read ON match_candidates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pet_reports r
      WHERE (r.id = report_a_id OR r.id = report_b_id)
        AND r.owner_user_id = auth.uid()
    )
  );
-- No direct INSERT/UPDATE/DELETE for members — the matching worker owns writes.
-- match_reviews: reviewer reads own rows; insert via reviewCandidate function.
CREATE POLICY match_reviews_select_own ON match_reviews
  FOR SELECT USING (reviewer_user_id = auth.uid());
-- reunion_verifications: involved participants read their own verifications.
CREATE POLICY reunion_verifications_participant_read ON reunion_verifications
  FOR SELECT USING (
    requested_by_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM match_candidates mc
      JOIN pet_reports r ON r.id IN (mc.report_a_id, mc.report_b_id)
      WHERE mc.id = candidate_id AND r.owner_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- stories: published + consented = public; drafts only for author/staff.
-- ---------------------------------------------------------------------------
CREATE POLICY stories_public_read ON stories
  FOR SELECT USING (visibility = 'public');
CREATE POLICY stories_author_draft ON stories
  FOR ALL USING (author_user_id = auth.uid() AND visibility = 'draft');

-- ---------------------------------------------------------------------------
-- alert_subscriptions: strictly subscriber-private. Opt-in writes allowed.
-- ---------------------------------------------------------------------------
CREATE POLICY alert_subscriptions_own ON alert_subscriptions
  FOR ALL USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- notification_deliveries: recipient reads own delivery statuses only.
-- ---------------------------------------------------------------------------
CREATE POLICY notification_deliveries_own ON notification_deliveries
  FOR SELECT USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- report_events: public sees only is_public subset; owner sees own case's.
-- ---------------------------------------------------------------------------
CREATE POLICY report_events_public_subset ON report_events
  FOR SELECT USING (
    is_public = true
    OR EXISTS (
      SELECT 1 FROM pet_reports r
      WHERE r.id = report_id AND r.owner_user_id = auth.uid()
    )
  );

-- jobs, audit_events, volunteer_assignments: no member-facing policies.
-- - jobs: worker/staff diagnostics only.
-- - audit_events: append-only via service role; moderator/admin read only.
-- - volunteer_assignments: moderator/admin manage; volunteer reads own list.
CREATE POLICY volunteer_assignments_read_own ON volunteer_assignments
  FOR SELECT USING (volunteer_user_id = auth.uid());
