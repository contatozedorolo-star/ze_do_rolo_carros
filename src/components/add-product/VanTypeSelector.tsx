import { Users, Package, Truck, Ambulance } from "lucide-react";

interface VanTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const vanTypes = [
  { value: "passageiro", label: "Passageiro / Escolar", description: "Turismo, executivo, escolar" },
  { value: "furgao", label: "Furgão / Carga Fechada", description: "Logística e e-commerce" },
  { value: "mista", label: "Mista / Ambulância / Especial", description: "Adaptadas e especiais" },
  { value: "carroceria", label: "Chassi / Carroceria", description: "Baú aberto ou plataforma" },
];

const getIcon = (val: string) => {
  switch (val) {
    case "passageiro": return Users;
    case "furgao": return Package;
    case "mista": return Ambulance;
    default: return Truck;
  }
};

const VanTypeSelector = ({ value, onChange }: VanTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {vanTypes.map((type) => {
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

export default VanTypeSelector;
