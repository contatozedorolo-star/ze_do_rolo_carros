import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FilterSection from "./FilterSection";
import { 
  implementoTypes, 
  implementoEixos, 
  implementoComprimentos
} from "./FilterData";

interface ImplementoFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
}

const ImplementoFilters = ({ filters, onFilterChange }: ImplementoFiltersProps) => {
  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onFilterChange(key, updated);
  };

  return (
    <>
      {/* Tipo de Carroceria/Implemento */}
      <FilterSection title="Tipo de Implemento">
        <div className="grid grid-cols-2 gap-2">
          {implementoTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => toggleArrayFilter("implemento_type", t.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.implemento_type || []).includes(t.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Número de Eixos */}
      <FilterSection title="Número de Eixos">
        <div className="flex flex-wrap gap-2">
          {implementoEixos.map((e) => (
            <button
              key={e.value}
              onClick={() => toggleArrayFilter("implemento_eixos", e.value)}
              className={`px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
                (filters.implemento_eixos || []).includes(e.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Comprimento */}
      <FilterSection title="Comprimento" defaultOpen={false}>
        <div className="space-y-2">
          {implementoComprimentos.map((c) => (
            <div key={c.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`impl-comp-${c.value}`}
                checked={(filters.implemento_comprimento || []).includes(c.value)}
                onCheckedChange={() => toggleArrayFilter("implemento_comprimento", c.value)}
              />
              <Label htmlFor={`impl-comp-${c.value}`} className="text-sm cursor-pointer">
                {c.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </>
  );
};

export default ImplementoFilters;
