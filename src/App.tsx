import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import MedicalSummaryPage from "./pages/MedicalSummaryPage";
import { AppLayout } from "./components/layout/AppLayout";
import AppHome from "./pages/app/AppHome";
import HealthAssistantPage from "./pages/app/HealthAssistantPage";
import HealthCheckPage from "./pages/app/HealthCheckPage";
import HealthCardPage from "./pages/app/HealthCardPage";
import ReportPage from "./pages/app/ReportPage";
import SettingsPage from "./pages/app/SettingsPage";
import WellnessPage from "./pages/app/WellnessPage";
import MedicalAIChatPage from "./pages/app/MedicalAIChatPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="neulife-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* AI Chat - Public Access (with message limits for non-logged in users) */}
            <Route path="/ai-chat" element={<MedicalAIChatPage />} />
            
            {/* Medical Summary - Public Access via QR */}
            <Route path="/medical-summary/:token" element={<MedicalSummaryPage />} />
            
            {/* NEULIFE Protected App Routes */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<AppHome />} />
              <Route path="health-assistant" element={<HealthAssistantPage />} />
              <Route path="health-check" element={<HealthCheckPage />} />
              <Route path="health-card" element={<HealthCardPage />} />
              <Route path="report" element={<ReportPage />} />
              <Route path="wellness" element={<WellnessPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
