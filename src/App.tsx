import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Triage from "./pages/Triage";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";
import AppHome from "./pages/app/AppHome";
import BodyMapPage from "./pages/app/BodyMapPage";
import DemoModePage from "./pages/app/DemoModePage";
import HealthCardPage from "./pages/app/HealthCardPage";
import ReportPage from "./pages/app/ReportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="new-life-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/triage" element={<Triage />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* NEULIFE App Routes */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<AppHome />} />
              <Route path="body-map" element={<BodyMapPage />} />
              <Route path="demo-mode" element={<DemoModePage />} />
              <Route path="health-card" element={<HealthCardPage />} />
              <Route path="report" element={<ReportPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
