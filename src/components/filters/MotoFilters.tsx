import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import FilterSection from "./FilterSection";
import { 
  motoStyles, 
  motoStartTypes, 
  motoMotorTypes, 
  motoBrakeTypes,
  motoOptionals,
  cylinderRanges,
  motoFuelSystems,
  motoUsageCategories,
  ratingRanges
} from "./FilterData";
import { ShieldCheck, Wrench, Zap, Gauge } from "lucide-react";

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
      {/* Filtros Rápidos */}
      <FilterSection title="Filtros Rápidos" defaultOpen={true}>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <Label className="text-sm cursor-pointer">Partida Elétrica</Label>
            </div>
            <Switch 
              checked={filters.has_electric_start || false}
              onCheckedChange={(v) => onFilterChange("has_electric_start", v)}
            />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              <Label className="text-sm cursor-pointer">Motor 4 Tempos</Label>
            </div>
            <Switch 
              checked={filters.has_4t_motor || false}
              onCheckedChange={(v) => onFilterChange("has_4t_motor", v)}
            />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <Label className="text-sm cursor-pointer">Aceita Troca</Label>
            </div>
            <Switch 
              checked={filters.accepts_trade || false}
              onCheckedChange={(v) => onFilterChange("accepts_trade", v)}
            />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-orange-500" />
              <Label className="text-sm cursor-pointer">Documento em Dia</Label>
            </div>
            <Switch 
              checked={filters.documents_ok || false}
              onCheckedChange={(v) => onFilterChange("documents_ok", v)}
            />
          </div>
        </div>
      </FilterSection>

      {/* Cilindradas */}
      <FilterSection title="Cilindradas" defaultOpen={true}>
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
      <FilterSection title="Estilo" defaultOpen={true}>
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

      {/* Qualidade Zé do Rolo */}
      <FilterSection title="Qualidade Zé do Rolo" defaultOpen={false}>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Nota mínima do motor</Label>
            <Slider 
              value={[filters.min_rating_motor || 0]}
              onValueChange={([v]) => onFilterChange("min_rating_motor", v)}
              min={0}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span className="text-primary font-medium">{filters.min_rating_motor || 0}+</span>
              <span>10</span>
            </div>
          </div>
          <div>
            <Label className="text-sm">Nota mínima geral</Label>
            <Slider 
              value={[filters.min_rating_geral || 0]}
              onValueChange={([v]) => onFilterChange("min_rating_geral", v)}
              min={0}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span className="text-primary font-medium">{filters.min_rating_geral || 0}+</span>
              <span>10</span>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Categoria de Uso */}
      <FilterSection title="Categoria de Uso" defaultOpen={false}>
        <div className="space-y-2">
          {motoUsageCategories.map((c) => (
            <div key={c.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`usage-${c.value}`}
                checked={(filters.usage_category || []).includes(c.value)}
                onCheckedChange={() => toggleArrayFilter("usage_category", c.value)}
              />
              <Label htmlFor={`usage-${c.value}`} className="text-sm cursor-pointer">
                {c.label}
              </Label>
            </div>
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

      {/* Alimentação */}
      <FilterSection title="Alimentação" defaultOpen={false}>
        <div className="space-y-2">
          {motoFuelSystems.map((f) => (
            <div key={f.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`fuel-${f.value}`}
                checked={(filters.fuel_system || []).includes(f.value)}
                onCheckedChange={() => toggleArrayFilter("fuel_system", f.value)}
              />
              <Label htmlFor={`fuel-${f.value}`} className="text-sm cursor-pointer">
                {f.label}
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
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
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

      {/* Segurança e Histórico */}
      <FilterSection title="Segurança e Histórico" defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="single_owner"
              checked={filters.is_single_owner || false}
              onCheckedChange={(v) => onFilterChange("is_single_owner", !!v)}
            />
            <Label htmlFor="single_owner" className="text-sm cursor-pointer">Único Dono</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ipva_paid"
              checked={filters.ipva_paid || false}
              onCheckedChange={(v) => onFilterChange("ipva_paid", !!v)}
            />
            <Label htmlFor="ipva_paid" className="text-sm cursor-pointer">IPVA Pago</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="no_auction"
              checked={filters.no_auction || false}
              onCheckedChange={(v) => onFilterChange("no_auction", !!v)}
            />
            <Label htmlFor="no_auction" className="text-sm cursor-pointer">Sem passagem por Leilão</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="no_remarked_chassis"
              checked={filters.no_remarked_chassis || false}
              onCheckedChange={(v) => onFilterChange("no_remarked_chassis", !!v)}
            />
            <Label htmlFor="no_remarked_chassis" className="text-sm cursor-pointer">Sem Chassis Remarcado</Label>
          </div>
        </div>
      </FilterSection>
    </>
  );
};

export default MotoFilters;
