import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import FilterSection from "./FilterSection";
import { 
  brands, 
  transmissionTypes, 
  ratingRanges,
  busSubcategories,
  busTractions,
  busSeatRanges,
  busFuelTypes
} from "./FilterData";

interface BusFiltersProps {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
}

const BusFilters = ({ filters, onFilterChange }: BusFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Tipo de Carroceria */}
      <FilterSection title="Tipo de Carroceria">
        <div className="space-y-2">
          {busSubcategories.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={`bus-${type.value}`}
                checked={filters.bus_subcategory === type.value}
                onCheckedChange={(checked) => 
                  onFilterChange("bus_subcategory", checked ? type.value : "")
                }
              />
              <Label htmlFor={`bus-${type.value}`} className="text-sm cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Marca */}
      <FilterSection title="Marca">
        <Select
          value={filters.brand || ""}
          onValueChange={(value) => onFilterChange("brand", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as marcas" />
          </SelectTrigger>
          <SelectContent className="bg-card max-h-60">
            <SelectItem value="">Todas as marcas</SelectItem>
            {brands.caminhao.map((brand) => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Capacidade de Lugares */}
      <FilterSection title="Capacidade de Lugares">
        <div className="space-y-2">
          {busSeatRanges.map((range) => (
            <div key={range.value} className="flex items-center space-x-2">
              <Checkbox
                id={`seats-${range.value}`}
                checked={filters.seats_range === range.value}
                onCheckedChange={(checked) => 
                  onFilterChange("seats_range", checked ? range.value : "")
                }
              />
              <Label htmlFor={`seats-${range.value}`} className="text-sm cursor-pointer">
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Tração */}
      <FilterSection title="Tração">
        <div className="space-y-2">
          {busTractions.map((traction) => (
            <div key={traction.value} className="flex items-center space-x-2">
              <Checkbox
                id={`traction-${traction.value}`}
                checked={filters.bus_traction === traction.value}
                onCheckedChange={(checked) => 
                  onFilterChange("bus_traction", checked ? traction.value : "")
                }
              />
              <Label htmlFor={`traction-${traction.value}`} className="text-sm cursor-pointer">
                {traction.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Combustível */}
      <FilterSection title="Combustível">
        <div className="space-y-2">
          {busFuelTypes.map((fuel) => (
            <div key={fuel.value} className="flex items-center space-x-2">
              <Checkbox
                id={`fuel-${fuel.value}`}
                checked={filters.fuel === fuel.value}
                onCheckedChange={(checked) => 
                  onFilterChange("fuel", checked ? fuel.value : "")
                }
              />
              <Label htmlFor={`fuel-${fuel.value}`} className="text-sm cursor-pointer">
                {fuel.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Câmbio */}
      <FilterSection title="Câmbio">
        <div className="space-y-2">
          {transmissionTypes.slice(0, 2).map((trans) => (
            <div key={trans.value} className="flex items-center space-x-2">
              <Checkbox
                id={`trans-${trans.value}`}
                checked={filters.transmission === trans.value}
                onCheckedChange={(checked) => 
                  onFilterChange("transmission", checked ? trans.value : "")
                }
              />
              <Label htmlFor={`trans-${trans.value}`} className="text-sm cursor-pointer">
                {trans.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Diagnóstico Zé do Rolo */}
      <FilterSection title="Qualidade Zé do Rolo">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Nota mínima Motor</Label>
            <Select
              value={filters.min_rating_motor || ""}
              onValueChange={(value) => onFilterChange("min_rating_motor", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Qualquer nota" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="">Qualquer nota</SelectItem>
                {ratingRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">Nota mínima Interior</Label>
            <Select
              value={filters.min_rating_interior || ""}
              onValueChange={(value) => onFilterChange("min_rating_interior", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Qualquer nota" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="">Qualquer nota</SelectItem>
                {ratingRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Nota mínima Mecânica Geral</Label>
            <Select
              value={filters.min_rating_geral || ""}
              onValueChange={(value) => onFilterChange("min_rating_geral", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Qualquer nota" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="">Qualquer nota</SelectItem>
                {ratingRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FilterSection>

      {/* Filtros Rápidos */}
      <FilterSection title="Filtros Rápidos">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ipva_paid"
              checked={filters.ipva_paid === true}
              onCheckedChange={(checked) => onFilterChange("ipva_paid", checked)}
            />
            <Label htmlFor="ipva_paid" className="text-sm cursor-pointer">IPVA Pago</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="docs_ok"
              checked={filters.docs_ok === true}
              onCheckedChange={(checked) => onFilterChange("docs_ok", checked)}
            />
            <Label htmlFor="docs_ok" className="text-sm cursor-pointer">Documentação em Dia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="no_auction"
              checked={filters.no_auction === true}
              onCheckedChange={(checked) => onFilterChange("no_auction", checked)}
            />
            <Label htmlFor="no_auction" className="text-sm cursor-pointer">Sem Leilão</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="accepts_trade"
              checked={filters.accepts_trade === true}
              onCheckedChange={(checked) => onFilterChange("accepts_trade", checked)}
            />
            <Label htmlFor="accepts_trade" className="text-sm cursor-pointer">Aceita Troca</Label>
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default BusFilters;
