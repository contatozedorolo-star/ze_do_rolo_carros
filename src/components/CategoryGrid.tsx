import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Import category images
import sedanImg from "@/assets/category-sedan.jpg";
import suvImg from "@/assets/category-suv.jpg";
import motoImg from "@/assets/category-moto.jpg";
import picapeImg from "@/assets/category-picape.jpg";
import caminhaoImg from "@/assets/category-caminhao.jpg";
import vanImg from "@/assets/category-van.jpg";

const vehicleCategories = [
  { 
    id: "carro", 
    name: "Carros", 
    image: sedanImg, 
    href: "/veiculos?tipo=carro" 
  },
  { 
    id: "suv", 
    name: "SUVs", 
    image: suvImg, 
    href: "/veiculos?tipo=suv" 
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
];

const CategoryGrid = () => {
  return (
    <section className="py-10">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8">
        Encontre por Categoria
      </h2>
      
      {/* Desktop: 3x2 grid, Tablet: 3 columns, Mobile: 2 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {vehicleCategories.map((category) => (
          <Link
            key={category.id}
            to={category.href}
            className={cn(
              "group relative overflow-hidden rounded-xl",
              "aspect-[4/3] md:aspect-[3/4]",
              "shadow-lg hover:shadow-xl",
              "transition-all duration-300 ease-out",
              "hover:scale-[1.03]",
              "ring-2 ring-transparent hover:ring-[#FF8C36]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C36]"
            )}
          >
            {/* Background Image */}
            <img
              src={category.image}
              alt={category.name}
              className={cn(
                "absolute inset-0 w-full h-full object-cover",
                "transition-transform duration-500 ease-out",
                "group-hover:scale-110"
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
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
