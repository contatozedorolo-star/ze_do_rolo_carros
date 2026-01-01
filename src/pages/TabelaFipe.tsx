import { useState, useEffect } from "react";
import { Car, Bike, Truck, Search, DollarSign, Calendar, Hash, Loader2, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const API_BASE = "https://parallelum.com.br/fipe/api/v1";

interface Brand { codigo: string; nome: string; }
interface Model { codigo: number; nome: string; }
interface Year { codigo: string; nome: string; }
interface FipeResult {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

const vehicleTypes = [
  { value: "carros", label: "Carros", icon: Car, apiPath: "carros" },
  { value: "motos", label: "Motos", icon: Bike, apiPath: "motos" },
  { value: "caminhoes", label: "Caminhões", icon: Truck, apiPath: "caminhoes" },
];

const TabelaFipe = () => {
  const { toast } = useToast();
  const [vehicleType, setVehicleType] = useState("carros");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [result, setResult] = useState<FipeResult | null>(null);
  
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingResult, setLoadingResult] = useState(false);

  // Clear all selections and result
  const handleClearAll = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedYear("");
    setModels([]);
    setYears([]);
    setResult(null);
  };

  // Fetch brands when vehicle type changes
  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      setSelectedBrand("");
      setSelectedModel("");
      setSelectedYear("");
      setBrands([]);
      setModels([]);
      setYears([]);
      setResult(null);

      try {
        const response = await fetch(`${API_BASE}/${vehicleType}/marcas`);
        const data = await response.json();
        setBrands(Array.isArray(data) ? data : []);
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível carregar as marcas", variant: "destructive" });
        setBrands([]);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, [vehicleType, toast]);

  // Fetch models when brand changes
  useEffect(() => {
    if (!selectedBrand) return;

    const fetchModels = async () => {
      setLoadingModels(true);
      setSelectedModel("");
      setSelectedYear("");
      setModels([]);
      setYears([]);
      setResult(null);

      try {
        const response = await fetch(`${API_BASE}/${vehicleType}/marcas/${selectedBrand}/modelos`);
        const data = await response.json();
        setModels(Array.isArray(data?.modelos) ? data.modelos : []);
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível carregar os modelos", variant: "destructive" });
        setModels([]);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedBrand, vehicleType, toast]);

  // Fetch years when model changes
  useEffect(() => {
    if (!selectedModel) return;

    const fetchYears = async () => {
      setLoadingYears(true);
      setSelectedYear("");
      setYears([]);
      setResult(null);

      try {
        const response = await fetch(`${API_BASE}/${vehicleType}/marcas/${selectedBrand}/modelos/${selectedModel}/anos`);
        const data = await response.json();
        setYears(Array.isArray(data) ? data : []);
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível carregar os anos", variant: "destructive" });
        setYears([]);
      } finally {
        setLoadingYears(false);
      }
    };

    fetchYears();
  }, [selectedModel, selectedBrand, vehicleType, toast]);

  // Fetch result when year changes
  const fetchResult = async () => {
    if (!selectedYear) return;

    setLoadingResult(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/${vehicleType}/marcas/${selectedBrand}/modelos/${selectedModel}/anos/${selectedYear}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível consultar o valor", variant: "destructive" });
    } finally {
      setLoadingResult(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]" />
        </div>
        
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Tabela FIPE
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Consulte o preço médio de veículos novos e usados em tempo real
            </p>
          </div>

          {/* Consultation Card */}
          <Card className="max-w-3xl mx-auto shadow-2xl">
            <CardContent className="p-6">
              {/* Vehicle Type Selection */}
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-4">Selecione o tipo de veículo</p>
                <div className="flex justify-center gap-2">
                  {vehicleTypes.map((type) => {
                    const Icon = type.icon;
                    const isActive = vehicleType === type.value;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setVehicleType(type.value)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                {/* Brand */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Marca</label>
                  <Select 
                    value={selectedBrand} 
                    onValueChange={setSelectedBrand}
                    disabled={loadingBrands || brands.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingBrands ? "Carregando..." : "Selecione a marca"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {brands.map((brand) => (
                        <SelectItem key={brand.codigo} value={brand.codigo}>
                          {brand.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Modelo</label>
                  <Select 
                    value={selectedModel} 
                    onValueChange={setSelectedModel}
                    disabled={!selectedBrand || loadingModels || models.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingModels ? "Carregando..." : "Selecione o modelo"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {models.map((model) => (
                        <SelectItem key={model.codigo} value={model.codigo.toString()}>
                          {model.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Ano</label>
                  <Select 
                    value={selectedYear} 
                    onValueChange={setSelectedYear}
                    disabled={!selectedModel || loadingYears || years.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingYears ? "Carregando..." : "Selecione o ano"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {years.map((year) => (
                        <SelectItem key={year.codigo} value={year.codigo}>
                          {year.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button 
                    variant="cta" 
                    className="w-full h-10"
                    onClick={fetchResult}
                    disabled={!selectedYear || loadingResult}
                  >
                    {loadingResult ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Consultar Valor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Result Section */}
      {result && (
        <section className="py-12 container">
          <Card className="max-w-3xl mx-auto border-2 border-accent/30 bg-accent/5">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">Valor FIPE</p>
                <h2 className="text-4xl md:text-5xl font-bold text-accent">
                  {result.Valor}
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <Car className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Veículo</p>
                    <p className="font-semibold">{result.Marca} {result.Modelo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Ano Modelo</p>
                    <p className="font-semibold">{result.AnoModelo} - {result.Combustivel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <Hash className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Código FIPE</p>
                    <p className="font-semibold">{result.CodigoFipe}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Mês Referência</p>
                    <p className="font-semibold">{result.MesReferencia}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/30">
                <p className="text-sm text-center text-muted-foreground">
                  💡 Este é o preço médio de mercado conforme a Tabela FIPE. 
                  Use como referência para negociações de compra, venda ou troca.
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleClearAll}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Nova Consulta
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Info Section */}
      <section className="py-12 container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Por que consultar a Tabela FIPE?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Preço Justo</h3>
                <p className="text-sm text-muted-foreground">
                  Saiba o valor de mercado antes de comprar ou vender
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Dados Atualizados</h3>
                <p className="text-sm text-muted-foreground">
                  Informações em tempo real direto da Tabela FIPE oficial
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Car className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Facilita Trocas</h3>
                <p className="text-sm text-muted-foreground">
                  Compare valores e calcule a diferença em negociações
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TabelaFipe;
