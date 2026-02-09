import { Tractor, Factory, Zap, Wrench } from "lucide-react";

interface TratorTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const tratorTypes = [
  { value: "compacto", label: "Compacto / Fruteiro", description: "Pomares, cafés, espaços estreitos" },
  { value: "medio", label: "Agrícola Médio", description: "O pau pra toda obra da fazenda" },
  { value: "alta_potencia", label: "Alta Potência", description: "Articulados e grandes lavouras" },
  { value: "retroescavadeira", label: "Retroescavadeira / Industrial", description: "Uso misto e construção" },
];

const getIcon = (val: string) => {
  switch (val) {
    case "compacto": return Tractor;
    case "medio": return Tractor;
    case "alta_potencia": return Zap;
    case "retroescavadeira": return Wrench;
    default: return Tractor;
  }
};

const TratorTypeSelector = ({ value, onChange }: TratorTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tratorTypes.map((type) => {
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

export default TratorTypeSelector;
