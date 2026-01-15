import { 
  Bike, 
  Zap, 
  Wind, 
  Mountain, 
  Gauge, 
  CircleDot,
  Car,
  Truck
} from "lucide-react";

interface MotoStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const motoStyleOptions = [
  { value: "ciclomotor", label: "Ciclomotor", description: "Até 50cc" },
  { value: "custom", label: "Custom", description: "Estilo clássico" },
  { value: "eletrica", label: "Elétrica", description: "Motor elétrico" },
  { value: "esportiva", label: "Esportiva", description: "Alta performance" },
  { value: "naked", label: "Naked", description: "Sem carenagem" },
  { value: "cross", label: "Cross/Off-Road", description: "Trilhas e terra" },
  { value: "quadriciclo", label: "Quadriciclo", description: "4 rodas" },
  { value: "scooter", label: "Scooter", description: "Urbana e prática" },
  { value: "street", label: "Street", description: "Uso urbano" },
  { value: "supermotard", label: "Supermotard", description: "Asfalto e terra" },
  { value: "touring", label: "Touring", description: "Longas viagens" },
  { value: "big_trail", label: "Big Trail", description: "Adventure" },
  { value: "trial", label: "Trial", description: "Obstáculos" },
  { value: "triciclo", label: "Triciclo", description: "3 rodas" },
  { value: "utilitaria", label: "Utilitária", description: "Trabalho" },
];

const getIconForStyle = (style: string) => {
  switch (style) {
    case "eletrica": return Zap;
    case "esportiva": return Gauge;
    case "cross": case "big_trail": case "trial": return Mountain;
    case "touring": return Wind;
    case "quadriciclo": return Car;
    case "triciclo": case "utilitaria": return Truck;
    default: return Bike;
  }
};

const MotoStyleSelector = ({ value, onChange }: MotoStyleSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {motoStyleOptions.map((style) => {
        const Icon = getIconForStyle(style.value);
        const isSelected = value === style.value;
        
        return (
          <button
            key={style.value}
            type="button"
            onClick={() => onChange(style.value)}
            className={`relative p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:shadow-md ${
              isSelected
                ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isSelected ? "bg-primary/10" : "bg-muted"
            }`}>
              <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="text-center">
              <span className={`text-sm font-semibold block ${isSelected ? "text-primary" : "text-foreground"}`}>
                {style.label}
              </span>
              <span className="text-xs text-muted-foreground">{style.description}</span>
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MotoStyleSelector;
