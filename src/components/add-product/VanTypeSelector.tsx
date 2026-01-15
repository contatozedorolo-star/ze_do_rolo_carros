import { Label } from "@/components/ui/label";
import { Users, Package, Truck } from "lucide-react";

interface VanTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const vanTypes = [
  { value: "passageiro", label: "Passageiro", icon: Users, description: "Transporte de pessoas" },
  { value: "furgao", label: "Furgão", icon: Package, description: "Carga fechada" },
  { value: "carroceria", label: "Carroceria", icon: Truck, description: "Carga aberta" },
];

const VanTypeSelector = ({ value, onChange }: VanTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {vanTypes.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all hover:scale-[1.02] ${
              value === type.value
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`p-4 rounded-full ${value === type.value ? "bg-primary/20" : "bg-muted"}`}>
              <Icon className={`h-10 w-10 ${value === type.value ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="text-center">
              <span className={`text-base font-semibold block ${value === type.value ? "text-primary" : ""}`}>
                {type.label}
              </span>
              <span className="text-xs text-muted-foreground">{type.description}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default VanTypeSelector;
