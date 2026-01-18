import { useRef, useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import category images
import suvImg from "@/assets/category-suv.jpg";
import motoImg from "@/assets/category-moto.jpg";
import picapeImg from "@/assets/category-picape.jpg";
import caminhaoImg from "@/assets/category-caminhao.jpg";
import vanImg from "@/assets/category-van.jpg";
import tratorImg from "@/assets/category-trator.jpg";
import implementoImg from "@/assets/category-implemento.jpg";

const vehicleCategories = [
  { 
    id: "carro", 
    name: "Carros", 
    image: suvImg, 
    href: "/veiculos?tipo=carro" 
  },
  { 
    id: "moto", 
    name: "Motos", 
    image: motoImg, 
    href: "/veiculos?tipo=moto" 
  },
  { 
    id: "camionete", 
    name: "Picapes", 
    image: picapeImg, 
    href: "/veiculos?tipo=camionete" 
  },
  { 
    id: "caminhao", 
    name: "Caminhões", 
    image: caminhaoImg, 
    href: "/veiculos?tipo=caminhao" 
  },
  { 
    id: "van", 
    name: "Vans", 
    image: vanImg, 
    href: "/veiculos?tipo=van" 
  },
  { 
    id: "trator", 
    name: "Tratores",
    image: tratorImg, 
    href: "/veiculos?tipo=trator" 
  },
  { 
    id: "implemento", 
    name: "Implementos", 
    image: implementoImg, 
    href: "/veiculos?tipo=implemento" 
  },
];

// Memoized category card for better performance
const CategoryCard = memo(({ category, index }: { category: typeof vehicleCategories[0], index: number }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <Link
      key={category.id}
      to={category.href}
      className={cn(
        "group relative overflow-hidden rounded-xl flex-shrink-0",
        "w-40 md:w-48 lg:w-52 aspect-[3/4]",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.03]",
        "ring-2 ring-transparent hover:ring-[#FF8C36]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C36]",
        "bg-muted"
      )}
    >
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {/* Background Image */}
      <img
        src={category.image}
        alt={category.name}
        loading={index < 4 ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          "transition-all duration-500 ease-out",
          "group-hover:scale-110",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Gradient Overlay */}
      <div 
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-t from-[#142562]/90 via-[#142562]/40 to-transparent",
          "transition-opacity duration-300",
          "group-hover:from-[#142562]/95 group-hover:via-[#142562]/50"
        )}
      />
      
      {/* Orange glow effect on hover */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100",
          "transition-opacity duration-300",
          "shadow-[inset_0_0_30px_rgba(255,140,54,0.3)]",
          "pointer-events-none"
        )}
      />
      
      {/* Category Name */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-center">
        <span 
          className={cn(
            "text-lg md:text-xl font-bold tracking-wide",
            "text-white drop-shadow-lg",
            "transition-transform duration-300",
            "group-hover:translate-y-[-4px]"
          )}
        >
          {category.name}
        </span>
      </div>
    </Link>
  );
});

CategoryCard.displayName = "CategoryCard";

const CategoryGrid = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <section className="py-10">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8">
        Encontre por Categoria
      </h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 md:w-12 md:h-12 rounded-full",
              "bg-background border border-border shadow-lg",
              "flex items-center justify-center",
              "hover:bg-muted transition-colors",
              "-ml-4 md:-ml-6"
            )}
            aria-label="Scroll para esquerda"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 md:w-12 md:h-12 rounded-full",
              "bg-background border border-border shadow-lg",
              "flex items-center justify-center",
              "hover:bg-muted transition-colors",
              "-mr-4 md:-mr-6"
            )}
            aria-label="Scroll para direita"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </button>
        )}

        {/* Categories Container */}
        <div 
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {vehicleCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
