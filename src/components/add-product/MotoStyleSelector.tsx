import { 
  Bike, 
  Wind, 
  Mountain, 
  Gauge, 
  CircleDot,
} from "lucide-react";

interface MotoStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const motoStyleOptions = [
  { value: "street", label: "Street / Urbana", description: "Uso diário na cidade" },
  { value: "scooter", label: "Scooter / Cub", description: "Prática e econômica" },
  { value: "cross", label: "Trail / Cross", description: "Trilhas e off-road" },
  { value: "esportiva", label: "Esportiva", description: "Alta performance" },
  { value: "custom", label: "Custom / Cruiser", description: "Estilo clássico" },
  { value: "touring", label: "Touring / Big Trail", description: "Longas viagens" },
];

const getIconForStyle = (style: string) => {
  switch (style) {
    case "esportiva": return Gauge;
    case "cross": return Mountain;
    case "touring": return Wind;
    case "scooter": return CircleDot;
    case "custom": return Bike;
    default: return Bike;
  }
};

const MotoStyleSelector = ({ value, onChange }: MotoStyleSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
