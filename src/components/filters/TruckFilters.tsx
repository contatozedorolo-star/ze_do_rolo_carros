import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import FilterSection from "./FilterSection";
import { 
  truckTypes, 
  truckTractions, 
  truckBodies, 
  truckCabins,
  truckPowerRanges,
  transmissionTypes
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
      <FilterSection title="Carroceria">
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
      <FilterSection title="Tipo de Cabine">
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

      {/* Potência */}
      <FilterSection title="Potência (CV)" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          {truckPowerRanges.map((p) => (
            <button
              key={p.value}
              onClick={() => toggleArrayFilter("truck_power", p.value)}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.truck_power || []).includes(p.value)
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
                id={`truck-trans-${t.value}`}
                checked={(filters.transmission || []).includes(t.value)}
                onCheckedChange={() => toggleArrayFilter("transmission", t.value)}
              />
              <Label htmlFor={`truck-trans-${t.value}`} className="text-sm cursor-pointer">
                {t.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Diagnóstico */}
      <FilterSection title="Qualidade Zé do Rolo" defaultOpen={false}>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-xs">Nota mínima Motor</Label>
              <span className="text-xs font-medium text-primary">{filters.min_rating_motor || 0}</span>
            </div>
            <Slider
              value={[filters.min_rating_motor || 0]}
              onValueChange={(v) => onFilterChange("min_rating_motor", v[0])}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-xs">Nota mínima Pneus</Label>
              <span className="text-xs font-medium text-primary">{filters.min_rating_pneus || 0}</span>
            </div>
            <Slider
              value={[filters.min_rating_pneus || 0]}
              onValueChange={(v) => onFilterChange("min_rating_pneus", v[0])}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-xs">Nota mínima Geral</Label>
              <span className="text-xs font-medium text-primary">{filters.min_rating_geral || 0}</span>
            </div>
            <Slider
              value={[filters.min_rating_geral || 0]}
              onValueChange={(v) => onFilterChange("min_rating_geral", v[0])}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </FilterSection>

      {/* Filtros Rápidos */}
      <FilterSection title="Status e Condições" defaultOpen={false}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="truck-ipva"
              checked={filters.ipva_paid === true}
              onCheckedChange={(checked) => onFilterChange("ipva_paid", checked ? true : null)}
            />
            <Label htmlFor="truck-ipva" className="text-sm cursor-pointer">IPVA Pago</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="truck-doc-dia"
              checked={filters.doc_em_dia === true}
              onCheckedChange={(checked) => onFilterChange("doc_em_dia", checked ? true : null)}
            />
            <Label htmlFor="truck-doc-dia" className="text-sm cursor-pointer">Documentação em Dia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="truck-no-auction"
              checked={filters.no_auction === true}
              onCheckedChange={(checked) => onFilterChange("no_auction", checked ? true : null)}
            />
            <Label htmlFor="truck-no-auction" className="text-sm cursor-pointer">Sem Passagem por Leilão</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="truck-aceita-troca"
              checked={filters.accepts_trade === true}
              onCheckedChange={(checked) => onFilterChange("accepts_trade", checked ? true : null)}
            />
            <Label htmlFor="truck-aceita-troca" className="text-sm cursor-pointer">Aceita Troca</Label>
          </div>
        </div>
      </FilterSection>
    </>
  );
};

export default TruckFilters;
