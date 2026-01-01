import { Car, Truck, Bike, Bus, CarFront, Container, Tractor, Cog } from "lucide-react";

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { value: "carro", label: "Carros", icon: Car },
  { value: "moto", label: "Motos", icon: Bike },
  { value: "caminhao", label: "Caminhões", icon: Truck },
  { value: "van", label: "Vans", icon: Bus },
  { value: "camionete", label: "Picapes", icon: CarFront },
  { value: "trator", label: "Tratores", icon: Tractor },
  { value: "implemento", label: "Implementos", icon: Cog },
];

const CategoryTabs = ({ selectedCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.value;
        
        return (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap ${
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/50 text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
