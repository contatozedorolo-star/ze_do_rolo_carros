import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Veiculos from "./pages/Veiculos";
import SearchResults from "./pages/SearchResults";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetail from "./pages/ProductDetail";
import HowItWorks from "./pages/HowItWorks";
import Dashboard from "./pages/Dashboard";
import AdminKYC from "./pages/AdminKYC";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminNotificacoes from "./pages/AdminNotificacoes";
import TabelaFipe from "./pages/TabelaFipe";
import FAQ from "./pages/FAQ";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import PoliticaCookies from "./pages/PoliticaCookies";
import AssistenteIA from "./pages/AssistenteIA";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
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
            <Route path="/busca" element={<SearchResults />} />
            <Route path="/veiculos" element={<Veiculos />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/editar-anuncio/:id" element={<EditProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/vehicle/:id" element={<ProductDetail />} />
            <Route path="/veiculo/:slug" element={<ProductDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/como-funciona" element={<HowItWorks />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/kyc" element={<AdminKYC />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/notificacoes" element={<AdminNotificacoes />} />
            <Route path="/tabela-fipe" element={<TabelaFipe />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/termos-de-uso" element={<TermosDeUso />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/politica-de-cookies" element={<PoliticaCookies />} />
            <Route path="/assistente-ia" element={<AssistenteIA />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
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
