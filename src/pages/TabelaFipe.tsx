import { useState, useEffect } from "react";
import { Car, Bike, Truck, DollarSign, Calendar, Hash, Loader2, RotateCcw, Fuel } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
  { value: "carros", label: "Carros", icon: Car },
  { value: "motos", label: "Motos", icon: Bike },
  { value: "caminhoes", label: "Caminhões", icon: Truck },
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
    const controller = new AbortController();
    const fetchBrands = async () => {
      setLoadingBrands(true);
      handleClearAll();
      setBrands([]);

      try {
        const response = await fetch(`${API_BASE}/${vehicleType}/marcas`, { signal: controller.signal });
        if (!response.ok) throw new Error("Erro na API");
        const data = await response.json();
        setBrands(Array.isArray(data) ? data : []);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          toast({ title: "Erro", description: "Não foi possível carregar as marcas. Tente novamente.", variant: "destructive" });
          setBrands([]);
        }
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
    return () => controller.abort();
  }, [vehicleType]);

  // Fetch models when brand changes
  useEffect(() => {
    if (!selectedBrand) return;

    const controller = new AbortController();
    const fetchModels = async () => {
      setLoadingModels(true);
      setSelectedModel("");
      setSelectedYear("");
      setModels([]);
      setYears([]);
      setResult(null);

      try {
        const response = await fetch(`${API_BASE}/${vehicleType}/marcas/${selectedBrand}/modelos`, { signal: controller.signal });
        if (!response.ok) throw new Error("Erro na API");
        const data = await response.json();
        setModels(Array.isArray(data?.modelos) ? data.modelos : []);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          toast({ title: "Erro", description: "Não foi possível carregar os modelos. Tente novamente.", variant: "destructive" });
          setModels([]);
        }
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
    return () => controller.abort();
  }, [selectedBrand, vehicleType]);

  // Fetch years when model changes
  useEffect(() => {
    if (!selectedModel) return;

    const controller = new AbortController();
    const fetchYears = async () => {
      setLoadingYears(true);
      setSelectedYear("");
      setYears([]);
      setResult(null);

      try {
        const response = await fetch(
          `${API_BASE}/${vehicleType}/marcas/${selectedBrand}/modelos/${selectedModel}/anos`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Erro na API");
        const data = await response.json();
        setYears(Array.isArray(data) ? data : []);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          toast({ title: "Erro", description: "Não foi possível carregar os anos. Tente novamente.", variant: "destructive" });
          setYears([]);
        }
      } finally {
        setLoadingYears(false);
      }
    };

    fetchYears();
    return () => controller.abort();
  }, [selectedModel, selectedBrand, vehicleType]);

  // Auto-fetch result when year is selected
  useEffect(() => {
    if (!selectedYear || !selectedModel || !selectedBrand) return;

    const controller = new AbortController();
    const fetchResult = async () => {
      setLoadingResult(true);
      setResult(null);

      try {
        const response = await fetch(
          `${API_BASE}/${vehicleType}/marcas/${selectedBrand}/modelos/${selectedModel}/anos/${selectedYear}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Erro na API");
        const data = await response.json();
        if (data && data.Valor) {
          setResult(data);
        } else {
          throw new Error("Dados inválidos");
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          toast({ title: "Erro", description: "Não foi possível consultar o valor FIPE. Tente novamente.", variant: "destructive" });
        }
      } finally {
        setLoadingResult(false);
      }
    };

    fetchResult();
    return () => controller.abort();
  }, [selectedYear, selectedModel, selectedBrand, vehicleType]);

  const SelectSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );

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
              Consulta Tabela FIPE
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Consulte o preço médio de veículos no mercado brasileiro em tempo real
            </p>
          </div>

          {/* Consultation Card */}
          <Card className="max-w-3xl mx-auto shadow-2xl">
            <CardContent className="p-6">
              {/* Vehicle Type Selection */}
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-4">Selecione o tipo de veículo</p>
                <div className="flex justify-center gap-2 flex-wrap">
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
              <div className="grid gap-4 md:grid-cols-3 mb-4">
                {/* Brand */}
                {loadingBrands ? (
                  <SelectSkeleton />
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Marca</label>
                    <Select
                      value={selectedBrand}
                      onValueChange={setSelectedBrand}
                      disabled={brands.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a marca" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-popover">
                        {brands.map((brand) => (
                          <SelectItem key={brand.codigo} value={brand.codigo}>
                            {brand.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Model */}
                {loadingModels ? (
                  <SelectSkeleton />
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Modelo</label>
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                      disabled={!selectedBrand || models.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedBrand ? "Selecione a marca primeiro" : "Selecione o modelo"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-popover">
                        {models.map((model) => (
                          <SelectItem key={model.codigo} value={model.codigo.toString()}>
                            {model.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Year */}
                {loadingYears ? (
                  <SelectSkeleton />
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Ano</label>
                    <Select
                      value={selectedYear}
                      onValueChange={setSelectedYear}
                      disabled={!selectedModel || years.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedModel ? "Selecione o modelo primeiro" : "Selecione o ano"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-popover">
                        {years.map((year) => (
                          <SelectItem key={year.codigo} value={year.codigo}>
                            {year.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Loading Result Indicator */}
              {loadingResult && (
                <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Consultando valor FIPE...</span>
                </div>
              )}
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
                  <Car className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Marca / Modelo</p>
                    <p className="font-semibold">{result.Marca} {result.Modelo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <Calendar className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Ano Modelo</p>
                    <p className="font-semibold">{result.AnoModelo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <Fuel className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Combustível</p>
                    <p className="font-semibold">{result.Combustivel} ({result.SiglaCombustivel})</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <Hash className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Código FIPE</p>
                    <p className="font-semibold">{result.CodigoFipe}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border md:col-span-2">
                  <DollarSign className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Mês de Referência</p>
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
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Dados Atualizados</h3>
                <p className="text-sm text-muted-foreground">
                  Informações atualizadas direto da base FIPE oficial
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
