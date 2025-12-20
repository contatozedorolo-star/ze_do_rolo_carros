import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import FilterSection from "./FilterSection";
import { 
  motoStyles, 
  motoStartTypes, 
  motoMotorTypes, 
  motoBrakeTypes,
  motoOptionals,
  cylinderRanges
} from "./FilterData";

interface MotoFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
}

const MotoFilters = ({ filters, onFilterChange }: MotoFiltersProps) => {
  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onFilterChange(key, updated);
  };

  return (
    <>
      {/* Cilindradas */}
      <FilterSection title="Cilindradas">
        <div className="flex flex-wrap gap-2">
          {cylinderRanges.map((c) => (
            <button
              key={c.value}
              onClick={() => toggleArrayFilter("cylinders", c.value)}
              className={`px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
                (filters.cylinders || []).includes(c.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Estilo */}
      <FilterSection title="Estilo">
        <div className="grid grid-cols-2 gap-2">
          {motoStyles.map((s) => (
            <button
              key={s.value}
              onClick={() => toggleArrayFilter("moto_style", s.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.moto_style || []).includes(s.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Partida */}
      <FilterSection title="Partida" defaultOpen={false}>
        <div className="space-y-2">
          {motoStartTypes.map((s) => (
            <div key={s.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`start-${s.value}`}
                checked={(filters.start_type || []).includes(s.value)}
                onCheckedChange={() => toggleArrayFilter("start_type", s.value)}
              />
              <Label htmlFor={`start-${s.value}`} className="text-sm cursor-pointer">
                {s.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Tipo de Motor */}
      <FilterSection title="Tipo de Motor" defaultOpen={false}>
        <div className="space-y-2">
          {motoMotorTypes.map((m) => (
            <div key={m.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`motor-${m.value}`}
                checked={(filters.motor_type || []).includes(m.value)}
                onCheckedChange={() => toggleArrayFilter("motor_type", m.value)}
              />
              <Label htmlFor={`motor-${m.value}`} className="text-sm cursor-pointer">
                {m.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Freios */}
      <FilterSection title="Freios" defaultOpen={false}>
        <div className="space-y-2">
          {motoBrakeTypes.map((b) => (
            <div key={b.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`brake-${b.value}`}
                checked={(filters.brake_type || []).includes(b.value)}
                onCheckedChange={() => toggleArrayFilter("brake_type", b.value)}
              />
              <Label htmlFor={`brake-${b.value}`} className="text-sm cursor-pointer">
                {b.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Opcionais */}
      <FilterSection title="Opcionais" defaultOpen={false}>
        <div className="space-y-2">
          {motoOptionals.map((o) => (
            <div key={o.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`optional-${o.value}`}
                checked={(filters.moto_optionals || []).includes(o.value)}
                onCheckedChange={() => toggleArrayFilter("moto_optionals", o.value)}
              />
              <Label htmlFor={`optional-${o.value}`} className="text-sm cursor-pointer">
                {o.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </>
  );
};

export default MotoFilters;
