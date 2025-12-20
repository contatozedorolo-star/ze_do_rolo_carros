import { useState } from "react";
import { Search, X, ChevronDown, ChevronUp, Star, CheckCircle, ArrowRightLeft, Gauge, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="py-4 border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-semibold text-foreground hover:text-primary transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
};

const brands = [
  { id: "chevrolet", name: "Chevrolet" },
  { id: "fiat", name: "Fiat" },
  { id: "ford", name: "Ford" },
  { id: "honda", name: "Honda" },
  { id: "hyundai", name: "Hyundai" },
  { id: "toyota", name: "Toyota" },
  { id: "volkswagen", name: "Volkswagen" },
  { id: "jeep", name: "Jeep" },
];

const years = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

const plateEndings = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const VehicleFilters = () => {
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [kmRange, setKmRange] = useState([0, 200000]);
  const [motorScore, setMotorScore] = useState([0]);

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-card rounded-xl border border-border p-4 lg:sticky lg:top-20 lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Filtros</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <X className="h-4 w-4 mr-1" />
          Limpar
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar modelo..."
          className="pl-10 bg-muted/50"
        />
      </div>

      <Separator />

      {/* Selo Diagnóstico Zé do Rolo */}
      <FilterSection title="Selo Diagnóstico Zé do Rolo">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="certified" />
            <Label htmlFor="certified" className="flex items-center gap-1.5 text-sm cursor-pointer">
              🏆 Zé do Rolo Certificado
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="verified" />
            <Label htmlFor="verified" className="flex items-center gap-1.5 text-sm cursor-pointer">
              <CheckCircle className="h-4 w-4 text-accent" />
              Documentação Verificada
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="goldSeller" />
            <Label htmlFor="goldSeller" className="flex items-center gap-1.5 text-sm cursor-pointer">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              Vendedor Nível Ouro
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="acceptsTrade" />
            <Label htmlFor="acceptsTrade" className="flex items-center gap-1.5 text-sm cursor-pointer">
              <ArrowRightLeft className="h-4 w-4 text-secondary" />
              Aceita Troca
            </Label>
          </div>
        </div>
      </FilterSection>

      {/* Marca */}
      <FilterSection title="Marca">
        <div className="grid grid-cols-2 gap-2">
          {brands.map((brand) => (
            <button
              key={brand.id}
              className="p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-xs font-medium text-center"
            >
              {brand.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Modelo */}
      <FilterSection title="Modelo">
        <Input placeholder="Digite o modelo..." className="bg-muted/50" />
      </FilterSection>

      {/* Ano */}
      <FilterSection title="Ano">
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <button
              key={year}
              className="px-3 py-1.5 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
            >
              {year}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Quilometragem */}
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
        </div>
      </FilterSection>

      {/* Câmbio */}
      <FilterSection title="Câmbio">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="automatic" />
            <Label htmlFor="automatic" className="text-sm cursor-pointer">Automático</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="manual" />
            <Label htmlFor="manual" className="text-sm cursor-pointer">Manual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cvt" />
            <Label htmlFor="cvt" className="text-sm cursor-pointer">CVT</Label>
          </div>
        </div>
      </FilterSection>

      {/* Combustível */}
      <FilterSection title="Combustível">
        <div className="space-y-2">
          {["Gasolina", "Diesel", "Flex", "Elétrico", "Híbrido", "GNV"].map((fuel) => (
            <div key={fuel} className="flex items-center space-x-2">
              <Checkbox id={fuel.toLowerCase()} />
              <Label htmlFor={fuel.toLowerCase()} className="text-sm cursor-pointer">{fuel}</Label>
            </div>
          ))}
        </div>
      </FilterSection>

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
              className="w-9 h-9 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium flex items-center justify-center"
            >
              {ending}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Diagnóstico Motor */}
      <FilterSection title="Diagnóstico do Motor" defaultOpen={false}>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Nota mínima</span>
            <span className="font-semibold text-primary">{motorScore[0]}/5</span>
          </div>
          <Slider
            value={motorScore}
            onValueChange={setMotorScore}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>5</span>
          </div>
        </div>
      </FilterSection>

      {/* Localização */}
      <FilterSection title="Localização" defaultOpen={false}>
        <Input placeholder="Digite sua cidade ou estado" className="bg-muted/50" />
      </FilterSection>

      <Button variant="cta" className="w-full mt-4">
        Aplicar Filtros
      </Button>
    </aside>
  );
};

export default VehicleFilters;
