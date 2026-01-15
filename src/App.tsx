import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Veiculos from "./pages/Veiculos";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./pages/ProductDetail";
import HowItWorks from "./pages/HowItWorks";
import Dashboard from "./pages/Dashboard";
import AdminKYC from "./pages/AdminKYC";
import TabelaFipe from "./pages/TabelaFipe";
import FAQ from "./pages/FAQ";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import AssistenteIA from "./pages/AssistenteIA";
import NotFound from "./pages/NotFound";
import FloatingAssistantButton from "./components/FloatingAssistantButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/veiculos" element={<Veiculos />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/vehicle/:id" element={<ProductDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/como-funciona" element={<HowItWorks />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/kyc" element={<AdminKYC />} />
            <Route path="/tabela-fipe" element={<TabelaFipe />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/termos-de-uso" element={<TermosDeUso />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/assistente-ia" element={<AssistenteIA />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingAssistantButton />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
