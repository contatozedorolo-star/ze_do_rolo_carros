import { useState } from "react";
import { MapPin, Star, CheckCircle, Award, ArrowRightLeft, Calendar, Gauge, Fuel } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  location: string;
  year: string;
  mileage: number;
  transmission: string;
  fuel: string;
  sellerLevel?: "bronze" | "prata" | "ouro";
  verified?: boolean;
  certified?: boolean;
  acceptsTrade?: boolean;
  requiresAuth?: boolean;
}

const sellerLevelConfig = {
  bronze: { label: "Bronze", className: "bg-amber-700/20 text-amber-700 border-amber-700/30" },
  prata: { label: "Prata", className: "bg-slate-400/20 text-slate-600 border-slate-400/30" },
  ouro: { label: "Ouro", className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" },
};

const VehicleCard = ({
  id,
  image,
  title,
  price,
  location,
  year,
  mileage,
  transmission,
  fuel,
  sellerLevel,
  verified,
  certified,
  acceptsTrade,
  requiresAuth = false,
}: VehicleCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const goToDetail = () => {
    if (requiresAuth) {
      navigate("/auth", { state: { from: `/product/${id}` } });
    } else {
      navigate(`/product/${id}`);
    }
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Ver detalhes de ${title}`}
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
          src={image}
          alt={title}
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
          {verified && (
            <Badge variant="outline" className="bg-accent/90 text-accent-foreground border-0 gap-1 text-xs font-medium backdrop-blur-sm">
              <CheckCircle className="h-3 w-3" />
              Verificado
            </Badge>
          )}
          {certified && (
            <Badge variant="outline" className="bg-primary/90 text-primary-foreground border-0 gap-1 text-xs font-medium backdrop-blur-sm">
              <Award className="h-3 w-3" />
              Certificado
            </Badge>
          )}
        </div>

        {acceptsTrade && (
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
          {title}
        </h3>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            <span>{mileage.toLocaleString("pt-BR")} Km</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-3 w-3" />
            <span>{fuel}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{location}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <p className="text-lg font-bold text-primary">R$ {price.toLocaleString("pt-BR")}</p>

          {sellerLevel && (
            <Badge
              variant="outline"
              className={cn(
                "gap-1 text-xs font-medium",
                sellerLevelConfig[sellerLevel].className
              )}
            >
              <Star className="h-3 w-3 fill-current" />
              {sellerLevelConfig[sellerLevel].label}
            </Badge>
          )}
        </div>

        <Button variant="cta" className="w-full" onClick={goToDetail}>
          Ver detalhes
        </Button>
      </div>
    </article>
  );
};

export default VehicleCard;
