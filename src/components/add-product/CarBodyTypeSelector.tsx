import { cn } from "@/lib/utils";

// Importing body type images
import bodyHatch from "@/assets/body-hatch.png";
import bodySuv from "@/assets/body-suv.png";
import bodySedan from "@/assets/body-sedan.png";
import bodyWagon from "@/assets/body-wagon.png";
import bodyPickup from "@/assets/body-pickup.png";
import bodyMinivan from "@/assets/body-minivan.png";
import bodyCoupe from "@/assets/body-coupe.png";
import bodyConversivel from "@/assets/body-conversivel.png";
import bodyBuggy from "@/assets/body-buggy.png";

const carBodyTypes = [
  { value: "buggy", label: "Buggy", image: bodyBuggy, icon: null },
  { value: "conversivel", label: "Conversível", image: bodyConversivel, icon: null },
  { value: "coupe", label: "Coupe", image: bodyCoupe, icon: null },
  { value: "hatch", label: "Hatch", image: bodyHatch, icon: null },
  { value: "minivan", label: "Minivan", image: bodyMinivan, icon: null },
  { value: "perua", label: "Perua", image: bodyWagon, icon: null },
  { value: "pickup", label: "Picape", image: bodyPickup, icon: null },
  { value: "sedan", label: "Sedan", image: bodySedan, icon: null },
  { value: "suv", label: "SUV", image: bodySuv, icon: null },
  { value: "van", label: "Van", image: bodyMinivan, icon: null },
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
            {type.image ? (
              <img 
                src={type.image} 
                alt={type.label} 
                className="h-8 w-auto mb-2 object-contain"
              />
            ) : (
              <span className="text-3xl mb-2">{type.icon}</span>
            )}
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
