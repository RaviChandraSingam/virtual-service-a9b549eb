import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import ServicesPage from "./pages/ServicesPage";
import StubMappingPage from "./pages/StubMappingPage";
import RuleEditorPage from "./pages/RuleEditorPage";
import RuleFlowPage from "./pages/RuleFlowPage";
import TestingPage from "./pages/TestingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<ServicesPage />} />
            <Route path="/stubs" element={<StubMappingPage />} />
            <Route path="/rules" element={<RuleEditorPage />} />
            <Route path="/flow" element={<RuleFlowPage />} />
            <Route path="/testing" element={<TestingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
