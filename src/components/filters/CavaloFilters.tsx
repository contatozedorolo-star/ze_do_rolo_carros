import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FilterSection from "./FilterSection";
import { 
  cavaloTractions, 
  cavaloCabins, 
  cavaloPotencias,
  transmissionTypes
} from "./FilterData";

interface CavaloFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
}

const CavaloFilters = ({ filters, onFilterChange }: CavaloFiltersProps) => {
  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onFilterChange(key, updated);
  };

  return (
    <>
      {/* Tração */}
      <FilterSection title="Tração">
        <div className="flex flex-wrap gap-2">
          {cavaloTractions.map((t) => (
            <button
              key={t.value}
              onClick={() => toggleArrayFilter("cavalo_traction", t.value)}
              className={`px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
                (filters.cavalo_traction || []).includes(t.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Cabine */}
      <FilterSection title="Tipo de Cabine">
        <div className="space-y-2">
          {cavaloCabins.map((c) => (
            <div key={c.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`cavalo-cabin-${c.value}`}
                checked={(filters.cavalo_cabin || []).includes(c.value)}
                onCheckedChange={() => toggleArrayFilter("cavalo_cabin", c.value)}
              />
              <Label htmlFor={`cavalo-cabin-${c.value}`} className="text-sm cursor-pointer">
                {c.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Potência */}
      <FilterSection title="Potência (CV)">
        <div className="grid grid-cols-2 gap-2">
          {cavaloPotencias.map((p) => (
            <button
              key={p.value}
              onClick={() => toggleArrayFilter("cavalo_potencia", p.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.cavalo_potencia || []).includes(p.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Câmbio */}
      <FilterSection title="Câmbio" defaultOpen={false}>
        <div className="space-y-2">
          {transmissionTypes.map((t) => (
            <div key={t.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`cavalo-trans-${t.value}`}
                checked={(filters.transmission || []).includes(t.value)}
                onCheckedChange={() => toggleArrayFilter("transmission", t.value)}
              />
              <Label htmlFor={`cavalo-trans-${t.value}`} className="text-sm cursor-pointer">
                {t.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </>
  );
};

export default CavaloFilters;
