import React from 'react';
import { Truck, Container, Car } from 'lucide-react';

interface TruckType {
  value: string;
  label: string;
  description: string;
}

const truckTypeOptions: TruckType[] = [
  { value: "3_4", label: "Caminhão 3/4", description: "Leve, até 3.500kg PBT" },
  { value: "toco", label: "Caminhão Toco", description: "Eixo simples traseiro" },
  { value: "truck", label: "Caminhão Truck", description: "Eixo duplo traseiro" },
  { value: "bitruck", label: "Caminhão Bitruck", description: "Dois eixos traseiros duplos" },
  { value: "cavalo_mecanico", label: "Cavalo Mecânico", description: "Para reboque de semirreboques" },
  { value: "vuc", label: "VUC", description: "Veículo Urbano de Carga" },
  { value: "fora_estrada", label: "Fora de Estrada", description: "Mineração e construção" },
];

interface TruckTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TruckTypeSelector: React.FC<TruckTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {truckTypeOptions.map((type) => (
        <button
          key={type.value}
          type="button"
          onClick={() => onChange(type.value)}
          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all text-center ${
            value === type.value 
              ? "border-primary bg-primary/5 shadow-md" 
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            value === type.value ? "bg-primary/10" : "bg-muted"
          }`}>
            {type.value === "cavalo_mecanico" ? (
              <Container className={`h-8 w-8 ${value === type.value ? "text-primary" : "text-muted-foreground"}`} />
            ) : type.value === "vuc" ? (
              <Car className={`h-8 w-8 ${value === type.value ? "text-primary" : "text-muted-foreground"}`} />
            ) : (
              <Truck className={`h-8 w-8 ${value === type.value ? "text-primary" : "text-muted-foreground"}`} />
            )}
          </div>
          <span className={`text-sm font-medium ${value === type.value ? "text-primary" : "text-foreground"}`}>
            {type.label}
          </span>
          <span className="text-xs text-muted-foreground">{type.description}</span>
        </button>
      ))}
    </div>
  );
};

export default TruckTypeSelector;
