import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FilterSection from "./FilterSection";
import { 
  tratorTypes, 
  tratorTractions, 
  tratorPotencias,
  horasUsoRanges
} from "./FilterData";

interface TratorFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
}

const TratorFilters = ({ filters, onFilterChange }: TratorFiltersProps) => {
  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onFilterChange(key, updated);
  };

  return (
    <>
      {/* Tipo de Máquina */}
      <FilterSection title="Tipo de Máquina">
        <div className="grid grid-cols-2 gap-2">
          {tratorTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => toggleArrayFilter("trator_type", t.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.trator_type || []).includes(t.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Horas de Uso */}
      <FilterSection title="Horas de Uso (Horímetro)">
        <div className="grid grid-cols-2 gap-2">
          {horasUsoRanges.map((h) => (
            <button
              key={h.value}
              onClick={() => toggleArrayFilter("hours_range", h.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.hours_range || []).includes(h.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Potência */}
      <FilterSection title="Potência (CV)">
        <div className="grid grid-cols-2 gap-2">
          {tratorPotencias.map((p) => (
            <button
              key={p.value}
              onClick={() => toggleArrayFilter("trator_potencia", p.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.trator_potencia || []).includes(p.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Tração */}
      <FilterSection title="Tração" defaultOpen={false}>
        <div className="space-y-2">
          {tratorTractions.map((t) => (
            <div key={t.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`trator-trac-${t.value}`}
                checked={(filters.trator_traction || []).includes(t.value)}
                onCheckedChange={() => toggleArrayFilter("trator_traction", t.value)}
              />
              <Label htmlFor={`trator-trac-${t.value}`} className="text-sm cursor-pointer">
                {t.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </>
  );
};

export default TratorFilters;
