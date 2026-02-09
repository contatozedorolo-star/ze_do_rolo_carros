import { Bus, CarTaxiFront, MapPin, GraduationCap } from "lucide-react";

interface BusTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const busTypes = [
  { value: "urbano", label: "Urbano / Circular", description: "Ônibus de linha, 2 ou 3 portas" },
  { value: "rodoviario", label: "Rodoviário / Viagem", description: "Bagageiro, poltronas reclináveis" },
  { value: "micro_onibus", label: "Micro-Ônibus", description: "Volare, fretamento, escolar curto" },
  { value: "escolar", label: "Escolar / Rural", description: "Adaptados para terrenos difíceis" },
];

const getIcon = (val: string) => {
  switch (val) {
    case "urbano": return Bus;
    case "rodoviario": return MapPin;
    case "micro_onibus": return CarTaxiFront;
    case "escolar": return GraduationCap;
    default: return Bus;
  }
};

const BusTypeSelector = ({ value, onChange }: BusTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {busTypes.map((type) => {
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

export default BusTypeSelector;
