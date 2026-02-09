import { Shovel, Sprout, Droplets, Wheat, Truck } from "lucide-react";

interface ImplementoTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const implementoTypes = [
  { value: "preparo_solo", label: "Preparo de Solo", description: "Arados, grades, subsoladores" },
  { value: "plantio", label: "Plantio e Adubação", description: "Plantadeiras, semeadeiras" },
  { value: "pulverizacao", label: "Pulverização", description: "Arrasto ou autopropelidos" },
  { value: "colheita", label: "Colheita e Fenação", description: "Colhedoras, enfardadeiras" },
  { value: "transporte", label: "Transporte e Manejo", description: "Carretas, conchas, lâminas" },
];

const getIcon = (val: string) => {
  switch (val) {
    case "preparo_solo": return Shovel;
    case "plantio": return Sprout;
    case "pulverizacao": return Droplets;
    case "colheita": return Wheat;
    case "transporte": return Truck;
    default: return Shovel;
  }
};

const ImplementoTypeSelector = ({ value, onChange }: ImplementoTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {implementoTypes.map((type) => {
        const Icon = getIcon(type.value);
        const isSelected = value === type.value;
        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
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
                {type.label}
              </span>
              <span className="text-xs text-muted-foreground">{type.description}</span>
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

export default ImplementoTypeSelector;
