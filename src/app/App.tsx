import { Routes, Route } from "react-router-dom";
import AppShell from "./AppShell";
import HomePage from "../pages/Home/HomePage";
import HowItWorksPage from "../pages/HowItWorks/HowItWorksPage";
import ComingSoonPage from "../pages/ComingSoon/ComingSoonPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        {/* Sitemap routes not yet implemented fall through to an honest
            placeholder rather than dead links or fake content. */}
        <Route path="*" element={<ComingSoonPage />} />
      </Route>
    </Routes>
  );
}
