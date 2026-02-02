import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import FilterSection from "./FilterSection";
import { 
  vanSubcategories, 
  transmissionTypes, 
  fuelTypes, 
  vanTractions, 
  vanSeatRanges 
} from "./FilterData";

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
      {/* Tipo de Carroceria */}
      <FilterSection title="Tipo de Carroceria">
        <div className="grid grid-cols-1 gap-2">
          {vanSubcategories.map((v) => (
            <button
              key={v.value}
              onClick={() => toggleArrayFilter("van_subcategory", v.value)}
              className={`p-3 rounded-lg border transition-all text-sm font-medium text-left ${
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

      {/* Lugares/Ocupantes */}
      <FilterSection title="Lugares">
        <div className="space-y-2">
          {vanSeatRanges.map((s) => (
            <div key={s.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`van-seats-${s.value}`}
                checked={(filters.seat_range || []).includes(s.value)}
                onCheckedChange={() => toggleArrayFilter("seat_range", s.value)}
              />
              <Label htmlFor={`van-seats-${s.value}`} className="text-sm cursor-pointer">
                {s.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Tração */}
      <FilterSection title="Tração">
        <div className="space-y-2">
          {vanTractions.map((t) => (
            <div key={t.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`van-traction-${t.value}`}
                checked={(filters.traction || []).includes(t.value)}
                onCheckedChange={() => toggleArrayFilter("traction", t.value)}
              />
              <Label htmlFor={`van-traction-${t.value}`} className="text-sm cursor-pointer">
                {t.label}
              </Label>
            </div>
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
          {fuelTypes.slice(0, 6).map((f) => (
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

      {/* Diagnóstico Zé do Rolo */}
      <FilterSection title="Qualidade Zé do Rolo">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Nota mínima Motor</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[filters.min_rating_motor || 0]}
                onValueChange={(v) => onFilterChange("min_rating_motor", v[0])}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm font-medium w-6 text-center">{filters.min_rating_motor || 0}</span>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Nota mínima Interior</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[filters.min_rating_interior || 0]}
                onValueChange={(v) => onFilterChange("min_rating_interior", v[0])}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm font-medium w-6 text-center">{filters.min_rating_interior || 0}</span>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Nota mínima Geral</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[filters.min_rating_geral || 0]}
                onValueChange={(v) => onFilterChange("min_rating_geral", v[0])}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm font-medium w-6 text-center">{filters.min_rating_geral || 0}</span>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Filtros Rápidos */}
      <FilterSection title="Filtros Rápidos">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="van-ipva-paid"
              checked={filters.ipva_paid || false}
              onCheckedChange={(checked) => onFilterChange("ipva_paid", checked)}
            />
            <Label htmlFor="van-ipva-paid" className="text-sm cursor-pointer">IPVA Pago</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="van-single-owner"
              checked={filters.is_single_owner || false}
              onCheckedChange={(checked) => onFilterChange("is_single_owner", checked)}
            />
            <Label htmlFor="van-single-owner" className="text-sm cursor-pointer">Único Dono</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="van-no-auction"
              checked={filters.no_auction || false}
              onCheckedChange={(checked) => onFilterChange("no_auction", checked)}
            />
            <Label htmlFor="van-no-auction" className="text-sm cursor-pointer">Sem Leilão</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="van-accepts-trade"
              checked={filters.accepts_trade || false}
              onCheckedChange={(checked) => onFilterChange("accepts_trade", checked)}
            />
            <Label htmlFor="van-accepts-trade" className="text-sm cursor-pointer">Aceita Troca</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="van-no-remarked-chassis"
              checked={filters.no_remarked_chassis || false}
              onCheckedChange={(checked) => onFilterChange("no_remarked_chassis", checked)}
            />
            <Label htmlFor="van-no-remarked-chassis" className="text-sm cursor-pointer">Sem Chassis Remarcado</Label>
          </div>
        </div>
      </FilterSection>
    </>
  );
};

export default VanFilters;
