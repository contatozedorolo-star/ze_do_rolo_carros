import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import FilterSection from "./FilterSection";
import { 
  carBodyTypes, 
  carNeedTypes, 
  transmissionTypes, 
  fuelTypes, 
  colorOptions,
  ratingRanges,
  engineLiters,
  doorOptions,
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
      {/* Aceita Troca */}
      <FilterSection title="Negociação">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="accepts-trade"
              checked={filters.accepts_trade === true}
              onCheckedChange={(checked) => onFilterChange("accepts_trade", checked ? true : null)}
            />
            <Label htmlFor="accepts-trade" className="text-sm cursor-pointer font-medium text-secondary">
              Aceita Troca
            </Label>
          </div>
        </div>
      </FilterSection>

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
      <FilterSection title="Carroceria">
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
      <FilterSection title="Tipo de Necessidade">
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

      {/* Qualidade - Notas de Diagnóstico */}
      <FilterSection title="Qualidade do Veículo" defaultOpen={false}>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">Filtrar por nota mínima do diagnóstico</p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rating-motor-high"
                checked={filters.min_rating_motor >= 8}
                onCheckedChange={(checked) => onFilterChange("min_rating_motor", checked ? 8 : null)}
              />
              <Label htmlFor="rating-motor-high" className="text-sm cursor-pointer">
                Motor nota 8+
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rating-mecanica-high"
                checked={filters.min_rating_mecanica >= 8}
                onCheckedChange={(checked) => onFilterChange("min_rating_mecanica", checked ? 8 : null)}
              />
              <Label htmlFor="rating-mecanica-high" className="text-sm cursor-pointer">
                Mecânica geral nota 8+
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rating-estetica-high"
                checked={filters.min_rating_estetica >= 8}
                onCheckedChange={(checked) => onFilterChange("min_rating_estetica", checked ? 8 : null)}
              />
              <Label htmlFor="rating-estetica-high" className="text-sm cursor-pointer">
                Estética nota 8+
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rating-documentacao-high"
                checked={filters.min_rating_documentacao >= 8}
                onCheckedChange={(checked) => onFilterChange("min_rating_documentacao", checked ? 8 : null)}
              />
              <Label htmlFor="rating-documentacao-high" className="text-sm cursor-pointer">
                Documentação nota 8+
              </Label>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Motor */}
      <FilterSection title="Motor" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {engineLiters.slice(0, 10).map((e) => (
            <button
              key={e.value}
              onClick={() => toggleArrayFilter("engine_liters", e.value)}
              className={`px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
                (filters.engine_liters || []).includes(e.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Portas */}
      <FilterSection title="Portas" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {doorOptions.map((d) => (
            <button
              key={d.value}
              onClick={() => toggleArrayFilter("doors", d.value)}
              className={`px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
                (filters.doors || []).includes(d.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {d.label}
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
      <FilterSection title="Procedência">
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
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="has-warranty"
              checked={filters.has_warranty === true}
              onCheckedChange={(checked) => onFilterChange("has_warranty", checked ? true : null)}
            />
            <Label htmlFor="has-warranty" className="text-sm cursor-pointer">
              Com garantia
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="not-financed"
              checked={filters.is_financed === false}
              onCheckedChange={(checked) => onFilterChange("is_financed", checked ? false : null)}
            />
            <Label htmlFor="not-financed" className="text-sm cursor-pointer">
              Quitado (não financiado)
            </Label>
          </div>
        </div>
      </FilterSection>
    </>
  );
};

export default CarFilters;
