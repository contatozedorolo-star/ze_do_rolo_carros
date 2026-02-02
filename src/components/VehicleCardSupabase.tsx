import { useState } from "react";
import { MapPin, Star, CheckCircle, Award, ArrowRightLeft, Calendar, Gauge, Fuel } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VehicleWithImages } from "@/hooks/useVehicles";
import { generateVehicleSlugWithId } from "@/lib/slugify";
import { formatCurrencyShort } from "@/lib/formatters";

interface VehicleCardSupabaseProps {
  vehicle: VehicleWithImages;
}

const VehicleCardSupabase = ({ vehicle }: VehicleCardSupabaseProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const slug = generateVehicleSlugWithId(
    vehicle.id,
    vehicle.brand,
    vehicle.model,
    vehicle.year_model,
    vehicle.version
  );

  const goToDetail = () => {
    navigate(`/veiculo/${slug}`);
  };

  const location = [vehicle.city, vehicle.state].filter(Boolean).join(", ") || "Brasil";
  const yearDisplay = vehicle.year_manufacture === vehicle.year_model 
    ? vehicle.year_model.toString() 
    : `${vehicle.year_manufacture}/${vehicle.year_model}`;

  const fuelLabels: Record<string, string> = {
    gasolina: "Gasolina",
    etanol: "Etanol",
    flex: "Flex",
    diesel: "Diesel",
    eletrico: "Elétrico",
    hibrido: "Híbrido",
    gnv: "GNV",
  };

  const transmissionLabels: Record<string, string> = {
    manual: "Manual",
    automatico: "Automático",
    cvt: "CVT",
    "semi-automatico": "Semi-Automático",
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Ver detalhes de ${vehicle.title}`}
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetail();
        }
      }}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border hover:border-primary/20"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={vehicle.primary_image}
          alt={vehicle.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {vehicle.has_ze_seal && (
            <Badge variant="outline" className="bg-accent/90 text-accent-foreground border-0 gap-1 text-xs font-medium backdrop-blur-sm">
              <CheckCircle className="h-3 w-3" />
              Verificado
            </Badge>
          )}
          {vehicle.is_featured && (
            <Badge variant="outline" className="bg-primary/90 text-primary-foreground border-0 gap-1 text-xs font-medium backdrop-blur-sm">
              <Award className="h-3 w-3" />
              Destaque
            </Badge>
          )}
        </div>

        {vehicle.accepts_trade && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-secondary/90 text-secondary-foreground border-0 gap-1 text-xs font-medium backdrop-blur-sm">
              <ArrowRightLeft className="h-3 w-3" />
              Aceita Troca
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors text-sm">
          {vehicle.title}
        </h3>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{yearDisplay}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            <span>{vehicle.km.toLocaleString("pt-BR")} Km</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-3 w-3" />
            <span>{fuelLabels[vehicle.fuel] || vehicle.fuel}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{location}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <p className="text-lg font-bold text-primary">
            {formatCurrencyShort(vehicle.price)}
          </p>
        </div>

        <Button variant="cta" className="w-full" onClick={goToDetail}>
          Ver detalhes
        </Button>
      </div>
    </article>
  );
};

export default VehicleCardSupabase;
