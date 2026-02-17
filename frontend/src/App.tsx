import { BrowserRouter, Route, Routes } from "react-router-dom";
import CalculatorHubPage from "./pages/CalculatorHubPage";
import CalculatorLandingPage from "./pages/CalculatorLandingPage";
import SanierungDashboardPage from "./pages/SanierungDashboardPage";
import WizardPage from "./pages/WizardPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalculatorHubPage />} />

        {/* ✅ Sanierung ima svoj dashboard */}
        <Route path="/k/sanierung" element={<SanierungDashboardPage />} />

        {/* ostali kalkulatori ostaju generic */}
        <Route path="/k/:type" element={<CalculatorLandingPage />} />

        {/* wizard za bilo koji type */}
        <Route path="/k/:type/wizard" element={<WizardPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
