import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FilterSection from "./FilterSection";
import { vanSubcategories, transmissionTypes, fuelTypes } from "./FilterData";

interface VanFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
}

const VanFilters = ({ filters, onFilterChange }: VanFiltersProps) => {
  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onFilterChange(key, updated);
  };

  return (
    <>
      {/* Subcategoria */}
      <FilterSection title="Tipo de Van">
        <div className="grid grid-cols-2 gap-2">
          {vanSubcategories.map((v) => (
            <button
              key={v.value}
              onClick={() => toggleArrayFilter("van_subcategory", v.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.van_subcategory || []).includes(v.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Câmbio */}
      <FilterSection title="Câmbio">
        <div className="space-y-2">
          {transmissionTypes.map((t) => (
            <div key={t.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`van-transmission-${t.value}`}
                checked={(filters.transmission || []).includes(t.value)}
                onCheckedChange={() => toggleArrayFilter("transmission", t.value)}
              />
              <Label htmlFor={`van-transmission-${t.value}`} className="text-sm cursor-pointer">
                {t.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Combustível */}
      <FilterSection title="Combustível">
        <div className="space-y-2">
          {fuelTypes.slice(0, 5).map((f) => (
            <div key={f.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`van-fuel-${f.value}`}
                checked={(filters.fuel || []).includes(f.value)}
                onCheckedChange={() => toggleArrayFilter("fuel", f.value)}
              />
              <Label htmlFor={`van-fuel-${f.value}`} className="text-sm cursor-pointer">
                {f.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </>
  );
};

export default VanFilters;
