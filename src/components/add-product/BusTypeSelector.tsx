import { Bus, CarTaxiFront } from "lucide-react";

interface BusTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const busTypes = [
  { 
    value: "onibus", 
    label: "Ônibus", 
    description: "Ônibus convencional e rodoviário",
    icon: Bus
  },
  { 
    value: "micro_onibus", 
    label: "Micro-Ônibus", 
    description: "Micro-ônibus e vans de transporte",
    icon: CarTaxiFront
  },
];

const BusTypeSelector = ({ value, onChange }: BusTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {busTypes.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:shadow-md ${
              value === type.value
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`p-4 rounded-full ${value === type.value ? "bg-primary/10" : "bg-muted"}`}>
              <Icon className={`h-12 w-12 ${value === type.value ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="text-center">
              <h4 className={`font-semibold text-lg ${value === type.value ? "text-primary" : ""}`}>
                {type.label}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
            </div>
            {value === type.value && (
              <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BusTypeSelector;
