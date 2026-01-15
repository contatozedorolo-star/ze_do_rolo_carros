import { cn } from "@/lib/utils";

const carBodyTypes = [
  { value: "buggy", label: "Buggy", icon: "🏎️" },
  { value: "conversivel", label: "Conversível", icon: "🚗" },
  { value: "coupe", label: "Cupê", icon: "🚘" },
  { value: "hatch", label: "Hatch", icon: "🚙" },
  { value: "minivan", label: "Minivan", icon: "🚐" },
  { value: "perua", label: "Perua", icon: "🚕" },
  { value: "pickup", label: "Picape", icon: "🛻" },
  { value: "sedan", label: "Sedã", icon: "🚗" },
  { value: "suv", label: "SUV", icon: "🚙" },
  { value: "van", label: "Van", icon: "🚐" },
];

interface CarBodyTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const CarBodyTypeSelector = ({ value, onChange }: CarBodyTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Selecione o tipo de carroceria do seu veículo
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {carBodyTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:border-primary/50",
              value === type.value
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card"
            )}
          >
            <span className="text-3xl mb-2">{type.icon}</span>
            <span className={cn(
              "text-sm font-medium",
              value === type.value ? "text-primary" : "text-foreground"
            )}>
              {type.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarBodyTypeSelector;
