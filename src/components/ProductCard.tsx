import { MapPin, Star, CheckCircle, ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  location: string;
  sellerLevel?: "bronze" | "prata" | "ouro";
  verified?: boolean;
  acceptsTrade?: boolean;
  category?: string;
}

const sellerLevelConfig = {
  bronze: { label: "Bronze", className: "bg-amber-700/20 text-amber-700 border-amber-700/30" },
  prata: { label: "Prata", className: "bg-slate-400/20 text-slate-600 border-slate-400/30" },
  ouro: { label: "Ouro", className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" },
};

const ProductCard = ({
  id,
  image,
  title,
  price,
  location,
  sellerLevel,
  verified,
  acceptsTrade,
  category,
}: ProductCardProps) => {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/product/${id}`);
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
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {verified && (
            <Badge variant="outline" className="bg-accent/90 text-accent-foreground border-0 gap-1 text-xs font-medium backdrop-blur-sm">
              <CheckCircle className="h-3 w-3" />
              Verificado
            </Badge>
          )}
          {acceptsTrade && (
            <Badge variant="outline" className="bg-secondary/90 text-secondary-foreground border-0 gap-1 text-xs font-medium backdrop-blur-sm">
              <ArrowRightLeft className="h-3 w-3" />
              Aceita Troca
            </Badge>
          )}
        </div>

        {/* Category Tag */}
        {category && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-card/90 text-card-foreground backdrop-blur-sm text-xs">
              {category}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-xl font-bold text-primary">R$ {price.toLocaleString("pt-BR")}</p>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{location}</span>
          </div>

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
      </div>
    </article>
  );
};

export default ProductCard;
