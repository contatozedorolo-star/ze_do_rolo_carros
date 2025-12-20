import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FilterSection from "./FilterSection";
import { 
  truckTypes, 
  truckTractions, 
  truckBodies, 
  truckCabins 
} from "./FilterData";

interface TruckFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
}

const TruckFilters = ({ filters, onFilterChange }: TruckFiltersProps) => {
  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onFilterChange(key, updated);
  };

  return (
    <>
      {/* Tipo de Caminhão */}
      <FilterSection title="Tipo de Caminhão">
        <div className="grid grid-cols-2 gap-2">
          {truckTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => toggleArrayFilter("truck_type", t.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.truck_type || []).includes(t.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Tração */}
      <FilterSection title="Tração">
        <div className="flex flex-wrap gap-2">
          {truckTractions.map((t) => (
            <button
              key={t.value}
              onClick={() => toggleArrayFilter("truck_traction", t.value)}
              className={`px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
                (filters.truck_traction || []).includes(t.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Carroceria */}
      <FilterSection title="Carroceria" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          {truckBodies.map((b) => (
            <button
              key={b.value}
              onClick={() => toggleArrayFilter("truck_body", b.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.truck_body || []).includes(b.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Cabine */}
      <FilterSection title="Cabine" defaultOpen={false}>
        <div className="space-y-2">
          {truckCabins.map((c) => (
            <div key={c.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`cabin-${c.value}`}
                checked={(filters.truck_cabin || []).includes(c.value)}
                onCheckedChange={() => toggleArrayFilter("truck_cabin", c.value)}
              />
              <Label htmlFor={`cabin-${c.value}`} className="text-sm cursor-pointer">
                {c.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </>
  );
};

export default TruckFilters;
