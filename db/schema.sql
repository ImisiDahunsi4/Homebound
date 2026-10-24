-- ============================================================================
-- HomeBound — Database Schema
-- ----------------------------------------------------------------------------
-- Schema definitions ONLY (see 04-data-model.md / 16-entity-permissions.md).
-- Written for PostgreSQL. No live database is created by this repo — these
-- files capture the intended structure, constraints and indexes so the
-- backend layer can be wired later. Auth is NOT enforced yet.
--
-- Core principle: private canonical data (pet_reports, contact, exact coords)
-- is strictly separated from the sanitized public projection (public_cases).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- Shared updated_at maintenance.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- profiles — extends the auth-provider user. Roles are server-controlled.
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL UNIQUE,                -- references auth user (external)
  display_name     text,
  avatar_asset_id  uuid,
  role             text NOT NULL DEFAULT 'member'
                   CHECK (role IN ('member', 'volunteer', 'moderator', 'admin')),
  role_approved_at timestamptz,
  timezone         text NOT NULL DEFAULT 'UTC',
  locale           text NOT NULL DEFAULT 'en',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
-- Role changes happen only through privileged admin functions; the client can
-- never submit role or role_approved_at. See db/policies.sql.

-- ---------------------------------------------------------------------------
-- pet_reports — PRIVATE canonical lost/found report.
-- Exact location and contact details live here and NEVER reach public reads.
-- ---------------------------------------------------------------------------
CREATE TABLE pet_reports (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id          uuid NOT NULL,                 -- set server-side only
  kind                   text NOT NULL CHECK (kind IN ('lost', 'found')),
  status                 text NOT NULL DEFAULT 'draft' CHECK (status IN (
                           'draft', 'pending_review', 'published', 'paused',
                           'reunion_pending', 'reunited',
                           'closed_unresolved', 'removed')),
  species                text NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'other')),
  breed                  text,
  name                   text,                          -- often unknown for found
  sex                    text CHECK (sex IN ('male', 'female', 'unknown')),
  age_category           text CHECK (age_category IN ('young', 'adult', 'senior', 'unknown')),
  size                   text CHECK (size IN ('small', 'medium', 'large', 'unknown')),
  colors                 text[] NOT NULL DEFAULT '{}',
  markings               text,
  temperament            text,
  collar_description     text,
  microchip_known        boolean,
  description            text NOT NULL,
  event_time             timestamptz NOT NULL,          -- last seen / found seen
  event_timezone         text NOT NULL DEFAULT 'UTC',
  -- private exact location (server-trusted only)
  location_private_lat   double precision CHECK (location_private_lat BETWEEN -90 AND 90),
  location_private_lng   double precision CHECK (location_private_lng BETWEEN -180 AND 180),
  location_private_addr  text,
  location_precision     text NOT NULL DEFAULT 'pin' CHECK (location_precision IN ('pin', 'area')),
  -- server-generalized public projection fields
  safe_public_area_label text,
  public_latitude        double precision,
  public_longitude       double precision,
  public_precision_m     integer,
  city                   text,
  region                 text,
  country_code           char(2),
  -- private contact (relay preferred; never public)
  contact_email          text,
  contact_phone          text,
  preferred_contact      text NOT NULL DEFAULT 'relay' CHECK (preferred_contact IN ('relay', 'email')),
  visibility             text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'hidden')),
  published_at           timestamptz,
  closed_at              timestamptz,
  version                integer NOT NULL DEFAULT 1,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER pet_reports_updated_at BEFORE UPDATE ON pet_reports
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX pet_reports_owner_idx ON pet_reports (owner_user_id, created_at DESC);
CREATE INDEX pet_reports_kind_status_idx ON pet_reports (kind, status, event_time);

-- ---------------------------------------------------------------------------
-- public_cases — PUBLIC sanitized read model. Written by server projection
-- only. This is the ONLY case data anonymous/Atlas clients may read.
-- ---------------------------------------------------------------------------
CREATE TABLE public_cases (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id             uuid NOT NULL UNIQUE REFERENCES pet_reports (id) ON DELETE CASCADE,
  kind                  text NOT NULL CHECK (kind IN ('lost', 'found')),
  status_public         text NOT NULL CHECK (status_public IN ('published', 'reunited')),
  public_title          text NOT NULL,
  species               text NOT NULL,
  breed_generalized     text,
  description_sanitized text NOT NULL,
  primary_image_public_url text,
  public_latitude       double precision NOT NULL,
  public_longitude      double precision NOT NULL,
  public_area_label     text NOT NULL,
  occurred_date_coarse  date,
  published_at          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
  -- Deliberately NO: raw lat/lng precision, address, phone/email, owner id,
  -- private notes, EXIF-bearing images. See 04-data-model.md PublicCase rules.
);
CREATE TRIGGER public_cases_updated_at BEFORE UPDATE ON public_cases
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX public_cases_atlas_idx ON public_cases (status_public, species, published_at DESC);
CREATE INDEX public_cases_geo_idx ON public_cases (public_latitude, public_longitude);

-- ---------------------------------------------------------------------------
-- report_photos — uploaded pet images. EXIF is stripped server-side.
-- ---------------------------------------------------------------------------
CREATE TABLE report_photos (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id          uuid NOT NULL REFERENCES pet_reports (id) ON DELETE CASCADE,
  owner_user_id      uuid NOT NULL,
  storage_key_private text NOT NULL,
  public_asset_url   text,                            -- set only after approval
  sort_index         smallint NOT NULL DEFAULT 0,
  alt_description    text,
  is_public_approved boolean NOT NULL DEFAULT false,
  photo_hash         text,
  created_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX report_photos_report_idx ON report_photos (report_id, sort_index);

-- ---------------------------------------------------------------------------
-- sightings — community-submitted sightings on a case.
-- ---------------------------------------------------------------------------
CREATE TABLE sightings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id             uuid NOT NULL REFERENCES public_cases (id) ON DELETE CASCADE,
  submitted_by_user_id uuid NOT NULL,
  description         text NOT NULL,
  event_time          timestamptz NOT NULL,
  private_location_lat double precision,
  private_location_lng double precision,
  public_area_label   text,
  status              text NOT NULL DEFAULT 'submitted' CHECK (status IN
                        ('submitted', 'under_review', 'shared', 'dismissed')),
  photo_ids           uuid[] NOT NULL DEFAULT '{}',
  reviewed_by         uuid,
  created_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sightings_case_idx ON sightings (case_id, created_at);

-- ---------------------------------------------------------------------------
-- match_candidates — deterministic suggestions. A match is a suggestion,
-- never proof of identity. raw_score is a ranking score, NOT a probability.
-- ---------------------------------------------------------------------------
CREATE TABLE match_candidates (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_a_id       uuid NOT NULL REFERENCES pet_reports (id) ON DELETE CASCADE,
  report_b_id       uuid NOT NULL REFERENCES pet_reports (id) ON DELETE CASCADE,
  pair_key          text NOT NULL,                     -- normalized sorted pair + algo version
  algorithm_version text NOT NULL,
  raw_score         numeric(5,2) NOT NULL CHECK (raw_score BETWEEN 0 AND 100),
  strength          text NOT NULL CHECK (strength IN ('strong', 'possible', 'weak')),
  reason_codes      text[] NOT NULL DEFAULT '{}',
  details_redacted  text[] NOT NULL DEFAULT '{}',
  status            text NOT NULL DEFAULT 'proposed' CHECK (status IN
                      ('proposed', 'reviewing', 'dismissed',
                       'accepted_for_contact', 'expired')),
  computed_at       timestamptz NOT NULL DEFAULT now(),
  reviewed_at       timestamptz,
  reviewed_by       uuid,
  expiry_at         timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  CHECK (report_a_id <> report_b_id),
  UNIQUE (pair_key, algorithm_version)
);
-- App-level invariant (cannot be a table CHECK across rows):
-- one side must be kind='lost', the other kind='found', both published.
CREATE INDEX match_candidates_reports_idx ON match_candidates (report_a_id, report_b_id, status);

-- ---------------------------------------------------------------------------
-- match_reviews — human review decisions on candidates. Staff notes private.
-- ---------------------------------------------------------------------------
CREATE TABLE match_reviews (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id     uuid NOT NULL REFERENCES match_candidates (id) ON DELETE CASCADE,
  reviewer_user_id uuid NOT NULL,
  decision         text NOT NULL CHECK (decision IN
                     ('needs_more_info', 'dismiss', 'contact', 'escalate')),
  notes_private    text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- reunion_verifications — two-party confirmation. Neither side may confirm
-- for the other; moderator override requires reason + audit.
-- ---------------------------------------------------------------------------
CREATE TABLE reunion_verifications (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id          uuid NOT NULL REFERENCES match_candidates (id) ON DELETE CASCADE,
  requested_by_user_id  uuid NOT NULL,
  owner_confirmed_at    timestamptz,
  finder_confirmed_at   timestamptz,
  moderator_approved_at timestamptz,
  moderator_id          uuid,
  status                text NOT NULL DEFAULT 'requested' CHECK (status IN
                          ('requested', 'awaiting_counterparty', 'disputed',
                           'verified', 'cancelled')),
  verification_method   text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  verified_at           timestamptz
);

-- ---------------------------------------------------------------------------
-- stories — public only after a VERIFIED reunion plus explicit consents.
-- ---------------------------------------------------------------------------
CREATE TABLE stories (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reunion_id       uuid NOT NULL UNIQUE REFERENCES reunion_verifications (id) ON DELETE CASCADE,
  title            text NOT NULL,
  body             text NOT NULL,
  cover_asset_id   uuid,
  author_user_id   uuid NOT NULL,
  consent_owner    boolean NOT NULL DEFAULT false,
  consent_finder   boolean NOT NULL DEFAULT false,
  consent_image    boolean NOT NULL DEFAULT false,
  visibility       text NOT NULL DEFAULT 'draft' CHECK (visibility IN
                     ('draft', 'public', 'withdrawn')),
  published_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CHECK (NOT (visibility = 'public' AND NOT (consent_owner AND consent_finder)))
);
CREATE TRIGGER stories_updated_at BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- alert_subscriptions — opt-in only. Private to the subscriber.
-- ---------------------------------------------------------------------------
CREATE TABLE alert_subscriptions (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL,
  area_center_lat    double precision NOT NULL,
  area_center_lng    double precision NOT NULL,
  radius_km          numeric(6,2) NOT NULL CHECK (radius_km > 0),
  species_filter     text[] NOT NULL DEFAULT '{}',
  channels           text[] NOT NULL DEFAULT '{}',      -- 'email' | 'in_app'
  is_active          boolean NOT NULL DEFAULT true,
  verified_contact   boolean NOT NULL DEFAULT false,
  frequency          text NOT NULL DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'digest')),
  quiet_hours        jsonb,
  consented_at       timestamptz NOT NULL DEFAULT now(), -- affirmative opt-in record
  created_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX alert_subscriptions_active_idx ON alert_subscriptions (is_active, user_id);

-- ---------------------------------------------------------------------------
-- notification_deliveries — truthful delivery state machine.
-- 'sent' means provider accepted dispatch, never "delivered" or "read".
-- ---------------------------------------------------------------------------
CREATE TABLE notification_deliveries (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL,
  report_id             uuid REFERENCES pet_reports (id) ON DELETE SET NULL,
  candidate_id          uuid REFERENCES match_candidates (id) ON DELETE SET NULL,
  event_key             text NOT NULL,
  channel               text NOT NULL CHECK (channel IN ('email', 'in_app')),
  status                text NOT NULL DEFAULT 'queued' CHECK (status IN
                          ('queued', 'sending', 'sent', 'failed',
                           'suppressed', 'retrying')),
  provider_message_id   text,
  attempts              integer NOT NULL DEFAULT 0,
  last_error_redacted   text,
  sent_at               timestamptz,
  idempotency_key       text NOT NULL UNIQUE,
  created_at            timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notification_deliveries_user_idx ON notification_deliveries (user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- report_events — case timeline events (public sees sanitized subset).
-- ---------------------------------------------------------------------------
CREATE TABLE report_events (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id        uuid NOT NULL REFERENCES pet_reports (id) ON DELETE CASCADE,
  actor_user_id    uuid,
  kind             text NOT NULL,
  redacted_summary text,
  is_public        boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX report_events_report_idx ON report_events (report_id, created_at);

-- ---------------------------------------------------------------------------
-- jobs — durable background work (matching, alerts). Idempotent by key.
-- ---------------------------------------------------------------------------
CREATE TABLE jobs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type            text NOT NULL,
  payload_ref     text,
  source_event_id uuid,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN
                    ('pending', 'running', 'done', 'failed')),
  attempts        integer NOT NULL DEFAULT 0,
  next_run_at     timestamptz,
  idempotency_key text NOT NULL UNIQUE,
  last_error_code text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- audit_events — append-only log of privileged actions. No UPDATE/DELETE.
-- ---------------------------------------------------------------------------
CREATE TABLE audit_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid,
  action        text NOT NULL,
  entity        text NOT NULL,
  entity_id     uuid,
  redacted_metadata jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- volunteer_assignments — assignment-scoped volunteer access.
-- ---------------------------------------------------------------------------
CREATE TABLE volunteer_assignments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_user_id uuid NOT NULL,
  report_id         uuid NOT NULL REFERENCES pet_reports (id) ON DELETE CASCADE,
  assigned_by       uuid NOT NULL,
  active            boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (volunteer_user_id, report_id)
);
