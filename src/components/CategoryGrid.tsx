import { Car, Smartphone, Sofa, Shirt, Wrench, Home, Gamepad2, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const categories = [
  { id: "veiculos", name: "Veículos", icon: Car, color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20", href: "/veiculos" },
  { id: "eletronicos", name: "Eletrônicos", icon: Smartphone, color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20", href: "/" },
  { id: "moveis", name: "Móveis", icon: Sofa, color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20", href: "/" },
  { id: "moda", name: "Moda", icon: Shirt, color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20", href: "/" },
  { id: "servicos", name: "Serviços", icon: Wrench, color: "bg-green-500/10 text-green-600 hover:bg-green-500/20", href: "/" },
  { id: "imoveis", name: "Imóveis", icon: Home, color: "bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20", href: "/" },
  { id: "games", name: "Games", icon: Gamepad2, color: "bg-red-500/10 text-red-600 hover:bg-red-500/20", href: "/" },
  { id: "esportes", name: "Esportes", icon: Dumbbell, color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20", href: "/" },
];

const CategoryGrid = () => {
  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
        Categorias
      </h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.href}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 group",
              category.color
            )}
          >
            <category.icon className="h-6 w-6 md:h-8 md:w-8 transition-transform group-hover:scale-110" />
            <span className="text-xs md:text-sm font-medium text-center text-foreground">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
