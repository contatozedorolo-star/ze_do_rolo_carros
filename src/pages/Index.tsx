import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, MapPin, Star, ArrowRightLeft } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import BlogSection from "@/components/BlogSection";
import { featuredVehicles, zeFindsVehicles, tradeVehicles } from "@/data/mockProducts";

interface VehicleSectionProps {
  title: string;
  description: string;
  vehicles: typeof featuredVehicles;
  icon: React.ReactNode;
}

const VehicleSection = ({ title, description, vehicles, icon }: VehicleSectionProps) => {
  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} {...vehicle} requiresAuth />
        ))}
      </div>
    </section>
  );
};

const Index = () => {
  const navigate = useNavigate();

  // Interceptar links de recuperação de senha que chegam na home
  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash && (hash.includes('access_token') || hash.includes('error') || hash.includes('type=recovery'))) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const type = hashParams.get('type');
      const errorCode = hashParams.get('error_code');
      const hasAccessToken = hash.includes('access_token');
      
      // Se for recovery (válido ou com erro), redirecionar para /auth?mode=reset
      if (type === 'recovery' || errorCode === 'otp_expired' || hasAccessToken) {
        // Preservar o hash para que o Auth.tsx possa processar
        navigate(`/auth?mode=reset`, { replace: true });
        // Após navegação, restaurar o hash
        setTimeout(() => {
          window.location.hash = hash.substring(1);
        }, 0);
        return;
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        
        <div className="container">
          <CategoryGrid />

          <VehicleSection
            title="Veículos Certificados"
            description="Veículos com diagnóstico completo e verificação do Zé do Rolo"
            vehicles={featuredVehicles}
            icon={<Star className="h-5 w-5 text-secondary" />}
          />

          <VehicleSection
            title="Achados do Zé"
            description="Veículos com excelente avaliação e documentação verificada"
            vehicles={zeFindsVehicles}
            icon={<Sparkles className="h-5 w-5 text-accent" />}
          />

          <VehicleSection
            title="Aceita Troca"
            description="Negocie seu veículo atual + dinheiro por um melhor"
            vehicles={tradeVehicles}
            icon={<ArrowRightLeft className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Blog Section */}
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
