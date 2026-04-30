import { Sparkles, Star, ArrowRightLeft } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import Footer from "@/components/Footer";
import VehicleCardSupabase from "@/components/VehicleCardSupabase";
import BlogSection from "@/components/BlogSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicles, VehicleWithImages } from "@/hooks/useVehicles";

interface VehicleSectionProps {
  title: string;
  description: string;
  vehicles: VehicleWithImages[];
  icon: React.ReactNode;
  isLoading?: boolean;
}

const VehicleSection = ({ title, description, vehicles, icon, isLoading }: VehicleSectionProps) => {
  if (!isLoading && (!vehicles || vehicles.length === 0)) return null;

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))
          : vehicles.map((vehicle) => (
              <VehicleCardSupabase key={vehicle.id} vehicle={vehicle} />
            ))}
      </div>
    </section>
  );
};

const Index = () => {
  // Veículos Certificados: com selo Zé do Rolo
  const { data: certifiedVehicles = [], isLoading: loadingCertified } = useVehicles({
    sortBy: "created_at",
    sortOrder: "desc",
    limit: 30,
  });

  // Aceita Troca
  const { data: tradeVehiclesData = [], isLoading: loadingTrade } = useVehicles({
    filters: { acceptsTrade: true },
    sortBy: "created_at",
    sortOrder: "desc",
    limit: 8,
  });

  // Achados do Zé: mais recentes (todos)
  const { data: latestVehicles = [], isLoading: loadingLatest } = useVehicles({
    sortBy: "created_at",
    sortOrder: "desc",
    limit: 8,
  });

  const featured = certifiedVehicles
    .filter((v) => v.has_ze_seal || v.is_featured)
    .slice(0, 8);

  // Fallback: se não houver veículos com selo, mostrar os mais recentes em "Certificados"
  const certifiedToShow = featured.length > 0 ? featured : latestVehicles.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />

        <div className="container relative z-10 bg-background">
          <CategoryGrid />

          <VehicleSection
            title="Veículos Certificados"
            description="Veículos com diagnóstico completo e verificação do Zé do Rolo"
            vehicles={certifiedToShow}
            icon={<Star className="h-5 w-5 text-secondary" />}
            isLoading={loadingCertified}
          />

          <VehicleSection
            title="Achados do Zé"
            description="Veículos com excelente avaliação e documentação verificada"
            vehicles={latestVehicles}
            icon={<Sparkles className="h-5 w-5 text-accent" />}
            isLoading={loadingLatest}
          />

          <VehicleSection
            title="Aceita Troca"
            description="Negocie seu veículo atual + dinheiro por um melhor"
            vehicles={tradeVehiclesData}
            icon={<ArrowRightLeft className="h-5 w-5 text-primary" />}
            isLoading={loadingTrade}
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
