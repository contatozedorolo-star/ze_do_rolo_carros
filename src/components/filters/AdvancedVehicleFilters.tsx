import { useState, useEffect } from "react";
import { Search, X, Star, CheckCircle, ArrowRightLeft, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import CategoryTabs from "./CategoryTabs";
import FilterSection from "./FilterSection";
import CarFilters from "./CarFilters";
import MotoFilters from "./MotoFilters";
import TruckFilters from "./TruckFilters";
import VanFilters from "./VanFilters";
import CavaloFilters from "./CavaloFilters";
import TratorFilters from "./TratorFilters";
import ImplementoFilters from "./ImplementoFilters";
import { brands, years, plateEndings, brazilianStates, horasUsoRanges } from "./FilterData";

interface AdvancedVehicleFiltersProps {
  onFiltersChange?: (filters: any) => void;
  initialCategory?: string;
}

const AdvancedVehicleFilters = ({ onFiltersChange, initialCategory }: AdvancedVehicleFiltersProps) => {
  const [category, setCategory] = useState(initialCategory || "carro");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [kmRange, setKmRange] = useState([0, 200000]);
  const [yearRange, setYearRange] = useState({ from: "", to: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Sync with initialCategory from parent
  useEffect(() => {
    if (initialCategory && initialCategory !== category) {
      setCategory(initialCategory);
      setFilters({});
      onFiltersChange?.({ category: initialCategory, priceRange, kmRange, yearRange, searchTerm });
    }
  }, [initialCategory]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.({ ...newFilters, category, priceRange, kmRange, yearRange, searchTerm });
  };

  const clearFilters = () => {
    setFilters({});
    setPriceRange([0, 500000]);
    setKmRange([0, 200000]);
    setYearRange({ from: "", to: "" });
    setSearchTerm("");
    onFiltersChange?.({ category });
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setFilters({});
    onFiltersChange?.({ category: newCategory, priceRange, kmRange, yearRange, searchTerm });
  };

  const applyFilters = () => {
    onFiltersChange?.({ ...filters, category, priceRange, kmRange, yearRange, searchTerm });
  };

  const currentBrands = brands[category as keyof typeof brands] || brands.carro;

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-card rounded-xl border border-border p-4 lg:sticky lg:top-20 lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Filtros</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Limpar
        </Button>
      </div>

      {/* Category Tabs */}
      <CategoryTabs selectedCategory={category} onCategoryChange={handleCategoryChange} />

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar modelo..."
          className="pl-10 bg-muted/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Separator />

      {/* Selo Diagnóstico Zé do Rolo */}
      <FilterSection title="Selo Diagnóstico">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="certified" 
              checked={filters.has_ze_seal === true}
              onCheckedChange={(checked) => handleFilterChange("has_ze_seal", checked ? true : null)}
            />
            <Label htmlFor="certified" className="flex items-center gap-1.5 text-sm cursor-pointer">
              🏆 Zé do Rolo Certificado
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="verified"
              checked={filters.verified_docs === true}
              onCheckedChange={(checked) => handleFilterChange("verified_docs", checked ? true : null)}
            />
            <Label htmlFor="verified" className="flex items-center gap-1.5 text-sm cursor-pointer">
              <CheckCircle className="h-4 w-4 text-accent" />
              Documentação Verificada
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="goldSeller"
              checked={filters.gold_seller === true}
              onCheckedChange={(checked) => handleFilterChange("gold_seller", checked ? true : null)}
            />
            <Label htmlFor="goldSeller" className="flex items-center gap-1.5 text-sm cursor-pointer">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              Vendedor Nível Ouro
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="acceptsTrade"
              checked={filters.accepts_trade === true}
              onCheckedChange={(checked) => handleFilterChange("accepts_trade", checked ? true : null)}
            />
            <Label htmlFor="acceptsTrade" className="flex items-center gap-1.5 text-sm cursor-pointer">
              <ArrowRightLeft className="h-4 w-4 text-secondary" />
              Aceita Troca
            </Label>
          </div>
        </div>
      </FilterSection>

      {/* Localização */}
      <FilterSection title="Localização">
        <div className="space-y-3">
          <Select value={filters.state || ""} onValueChange={(v) => handleFilterChange("state", v)}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {brazilianStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input 
            placeholder="Cidade" 
            className="bg-muted/50"
            value={filters.city || ""}
            onChange={(e) => handleFilterChange("city", e.target.value)}
          />
        </div>
      </FilterSection>

      {/* Marca */}
      <FilterSection title="Marca">
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {currentBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => {
                const current = filters.brand || [];
                const updated = current.includes(brand)
                  ? current.filter((b: string) => b !== brand)
                  : [...current, brand];
                handleFilterChange("brand", updated);
              }}
              className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                (filters.brand || []).includes(brand)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Modelo */}
      <FilterSection title="Modelo">
        <Input 
          placeholder="Digite o modelo..." 
          className="bg-muted/50"
          value={filters.model || ""}
          onChange={(e) => handleFilterChange("model", e.target.value)}
        />
      </FilterSection>

      {/* Ano */}
      <FilterSection title="Ano">
        <div className="flex gap-2">
          <Select value={yearRange.from} onValueChange={(v) => setYearRange({ ...yearRange, from: v })}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="De" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yearRange.to} onValueChange={(v) => setYearRange({ ...yearRange, to: v })}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="Até" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FilterSection>

      {/* Quilometragem / Horímetro */}
      {(category === "trator" || category === "implemento") ? (
        <FilterSection title="Horas de Uso (Horímetro)">
          <div className="grid grid-cols-2 gap-2">
            {horasUsoRanges.map((h) => (
              <button
                key={h.value}
                onClick={() => {
                  const current = filters.hours_range || [];
                  const updated = current.includes(h.value)
                    ? current.filter((v: string) => v !== h.value)
                    : [...current, h.value];
                  handleFilterChange("hours_range", updated);
                }}
                className={`p-2 rounded-lg border transition-all text-xs font-medium text-center ${
                  (filters.hours_range || []).includes(h.value)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </FilterSection>
      ) : (
        <FilterSection title="Quilometragem">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Mínimo</Label>
                <Input
                  type="text"
                  value={`${kmRange[0].toLocaleString("pt-BR")} km`}
                  className="bg-muted/50 text-sm"
                  readOnly
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Máximo</Label>
                <Input
                  type="text"
                  value={`${kmRange[1].toLocaleString("pt-BR")} km`}
                  className="bg-muted/50 text-sm"
                  readOnly
                />
              </div>
            </div>
            <Slider
              value={kmRange}
              onValueChange={setKmRange}
              max={300000}
              step={5000}
              className="w-full"
            />
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="zero-km"
                checked={filters.is_new === true}
                onCheckedChange={(checked) => handleFilterChange("is_new", checked ? true : null)}
              />
              <Label htmlFor="zero-km" className="text-sm cursor-pointer">Apenas 0 km</Label>
            </div>
          </div>
        </FilterSection>
      )}

      {/* Preço */}
      <FilterSection title="Preço">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Mínimo</Label>
              <Input
                type="text"
                value={`R$ ${priceRange[0].toLocaleString("pt-BR")}`}
                className="bg-muted/50 text-sm"
                readOnly
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Máximo</Label>
              <Input
                type="text"
                value={`R$ ${priceRange[1].toLocaleString("pt-BR")}`}
                className="bg-muted/50 text-sm"
                readOnly
              />
            </div>
          </div>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000000}
            step={10000}
            className="w-full"
          />
        </div>
      </FilterSection>

      {/* Final da Placa */}
      <FilterSection title="Final da Placa" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {plateEndings.map((ending) => (
            <button
              key={ending}
              onClick={() => {
                const current = filters.plate_end || [];
                const updated = current.includes(ending)
                  ? current.filter((e: string) => e !== ending)
                  : [...current, ending];
                handleFilterChange("plate_end", updated);
              }}
              className={`w-9 h-9 rounded-lg border transition-all text-sm font-medium flex items-center justify-center ${
                (filters.plate_end || []).includes(ending)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {ending}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Category-Specific Filters */}
      {category === "carro" && <CarFilters filters={filters} onFilterChange={handleFilterChange} />}
      {category === "moto" && <MotoFilters filters={filters} onFilterChange={handleFilterChange} />}
      {category === "caminhao" && <TruckFilters filters={filters} onFilterChange={handleFilterChange} />}
      {(category === "van" || category === "camionete") && <VanFilters filters={filters} onFilterChange={handleFilterChange} />}
      {category === "cavalo" && <CavaloFilters filters={filters} onFilterChange={handleFilterChange} />}
      {category === "trator" && <TratorFilters filters={filters} onFilterChange={handleFilterChange} />}
      {category === "implemento" && <ImplementoFilters filters={filters} onFilterChange={handleFilterChange} />}

      <Button variant="cta" className="w-full mt-4" onClick={applyFilters}>
        Aplicar Filtros
      </Button>
    </aside>
  );
};

export default AdvancedVehicleFilters;
