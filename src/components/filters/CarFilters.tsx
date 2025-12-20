import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FilterSection from "./FilterSection";
import { 
  carBodyTypes, 
  carNeedTypes, 
  transmissionTypes, 
  fuelTypes, 
  colorOptions 
} from "./FilterData";

interface CarFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
}

const CarFilters = ({ filters, onFilterChange }: CarFiltersProps) => {
  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onFilterChange(key, updated);
  };

  return (
    <>
      {/* Câmbio */}
      <FilterSection title="Câmbio">
        <div className="space-y-2">
          {transmissionTypes.map((t) => (
            <div key={t.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`transmission-${t.value}`}
                checked={(filters.transmission || []).includes(t.value)}
                onCheckedChange={() => toggleArrayFilter("transmission", t.value)}
              />
              <Label htmlFor={`transmission-${t.value}`} className="text-sm cursor-pointer">
                {t.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Combustível */}
      <FilterSection title="Combustível">
        <div className="space-y-2">
          {fuelTypes.map((f) => (
            <div key={f.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`fuel-${f.value}`}
                checked={(filters.fuel || []).includes(f.value)}
                onCheckedChange={() => toggleArrayFilter("fuel", f.value)}
              />
              <Label htmlFor={`fuel-${f.value}`} className="text-sm cursor-pointer">
                {f.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Carroceria */}
      <FilterSection title="Carroceria" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          {carBodyTypes.map((b) => (
            <button
              key={b.value}
              onClick={() => toggleArrayFilter("body_type", b.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.body_type || []).includes(b.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Tipo de Necessidade */}
      <FilterSection title="Tipo de Necessidade" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {carNeedTypes.map((n) => (
            <button
              key={n.value}
              onClick={() => toggleArrayFilter("need_type", n.value)}
              className={`px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
                (filters.need_type || []).includes(n.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Blindagem */}
      <FilterSection title="Blindagem" defaultOpen={false}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="armored-yes"
              checked={filters.is_armored === true}
              onCheckedChange={(checked) => onFilterChange("is_armored", checked ? true : null)}
            />
            <Label htmlFor="armored-yes" className="text-sm cursor-pointer">
              Blindado
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="armored-no"
              checked={filters.is_armored === false}
              onCheckedChange={(checked) => onFilterChange("is_armored", checked ? false : null)}
            />
            <Label htmlFor="armored-no" className="text-sm cursor-pointer">
              Não blindado
            </Label>
          </div>
        </div>
      </FilterSection>

      {/* Cor */}
      <FilterSection title="Cor" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {colorOptions.slice(0, 10).map((color) => (
            <button
              key={color}
              onClick={() => toggleArrayFilter("color", color)}
              className={`px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
                (filters.color || []).includes(color)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Procedência */}
      <FilterSection title="Procedência" defaultOpen={false}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="single-owner"
              checked={filters.is_single_owner === true}
              onCheckedChange={(checked) => onFilterChange("is_single_owner", checked ? true : null)}
            />
            <Label htmlFor="single-owner" className="text-sm cursor-pointer">
              Único dono
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ipva-paid"
              checked={filters.ipva_paid === true}
              onCheckedChange={(checked) => onFilterChange("ipva_paid", checked ? true : null)}
            />
            <Label htmlFor="ipva-paid" className="text-sm cursor-pointer">
              IPVA pago
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="service-history"
              checked={filters.has_service_history === true}
              onCheckedChange={(checked) => onFilterChange("has_service_history", checked ? true : null)}
            />
            <Label htmlFor="service-history" className="text-sm cursor-pointer">
              Revisões em dia
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="not-auction"
              checked={filters.is_auction === false}
              onCheckedChange={(checked) => onFilterChange("is_auction", checked ? false : null)}
            />
            <Label htmlFor="not-auction" className="text-sm cursor-pointer">
              Não é de leilão
            </Label>
          </div>
        </div>
      </FilterSection>
    </>
  );
};

export default CarFilters;
