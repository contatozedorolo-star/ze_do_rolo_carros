import { Sparkles, MapPin, Star } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import { featuredProducts, nearbyProducts, zeFindsProducts } from "@/data/mockProducts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        
        <div className="container">
          <CategoryGrid />

          <ProductSection
            title="Mais Procurados"
            description="Os itens mais buscados da semana"
            products={featuredProducts}
            icon={<Star className="h-5 w-5 text-secondary" />}
          />

          <ProductSection
            title="Achados do Zé"
            description="Itens com ótimo diagnóstico e verificação completa"
            products={zeFindsProducts}
            icon={<Sparkles className="h-5 w-5 text-accent" />}
          />

          <ProductSection
            title="Perto de Você"
            description="Itens com logística fácil na sua região"
            products={nearbyProducts}
            icon={<MapPin className="h-5 w-5 text-primary" />}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
