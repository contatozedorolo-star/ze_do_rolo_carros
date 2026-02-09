import React from 'react';
import { Truck, Container, Car } from 'lucide-react';

interface TruckType {
  value: string;
  label: string;
  description: string;
}

const truckTypeOptions: TruckType[] = [
  { value: "3_4", label: "Leve / 3/4", description: "Entrega urbana (Delivery, Accelo)" },
  { value: "toco", label: "Toco (4x2)", description: "Médio, um eixo traseiro" },
  { value: "truck", label: "Truck (6x2 / 6x4)", description: "Pesado, eixo duplo traseiro" },
  { value: "cavalo_mecanico", label: "Cavalo Mecânico", description: "Cabine para rebocar carreta" },
  { value: "caminhonete_furgao", label: "Caminhonete / Furgão", description: "HR, Bongo, Iveco Daily" },
];

const getIcon = (val: string) => {
  switch (val) {
    case "cavalo_mecanico": return Container;
    case "caminhonete_furgao": return Car;
    default: return Truck;
  }
};

interface TruckTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TruckTypeSelector: React.FC<TruckTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {truckTypeOptions.map((type) => {
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

export default TruckTypeSelector;
