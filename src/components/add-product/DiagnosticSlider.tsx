import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface DiagnosticSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
}

const DiagnosticSlider = ({ label, value, onChange, description }: DiagnosticSliderProps) => {
  const getColor = (val: number) => {
    if (val <= 3) return "text-red-500";
    if (val <= 5) return "text-orange-500";
    if (val <= 7) return "text-yellow-500";
    return "text-green-500";
  };

  const getLabel = (val: number) => {
    if (val === 0) return "Péssimo";
    if (val <= 3) return "Ruim";
    if (val <= 5) return "Regular";
    if (val <= 7) return "Bom";
    if (val <= 9) return "Ótimo";
    return "Perfeito";
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-foreground">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="text-right">
          <span className={cn("text-2xl font-bold", getColor(value))}>
            {value}
          </span>
          <span className="text-sm text-muted-foreground">/10</span>
          <p className={cn("text-xs font-medium", getColor(value))}>
            {getLabel(value)}
          </p>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        max={10}
        min={0}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
};

export default DiagnosticSlider;
