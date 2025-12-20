import { Car, Truck, Bike, CarFront, Bus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const vehicleCategories = [
  { id: "sedan", name: "Sedans", icon: Car, color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20", href: "/veiculos?tipo=sedan" },
  { id: "suv", name: "SUVs", icon: CarFront, color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20", href: "/veiculos?tipo=suv" },
  { id: "caminhao", name: "Caminhões", icon: Truck, color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20", href: "/veiculos?tipo=caminhao" },
  { id: "moto", name: "Motos", icon: Bike, color: "bg-green-500/10 text-green-600 hover:bg-green-500/20", href: "/veiculos?tipo=moto" },
  { id: "picape", name: "Picapes", icon: Truck, color: "bg-red-500/10 text-red-600 hover:bg-red-500/20", href: "/veiculos?tipo=picape" },
  { id: "van", name: "Vans", icon: Bus, color: "bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20", href: "/veiculos?tipo=van" },
];

const CategoryGrid = () => {
  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
        Tipos de Veículos
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {vehicleCategories.map((category) => (
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
