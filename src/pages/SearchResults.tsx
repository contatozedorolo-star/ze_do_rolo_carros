import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, Grid3X3, List, ChevronDown, ArrowLeft, MapPin, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCardSupabase from "@/components/VehicleCardSupabase";
import VehicleCard from "@/components/VehicleCard";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { vehicles as mockVehicles } from "@/data/mockProducts";
import { sortOptions, brazilianStates } from "@/components/filters/FilterData";
import { useAuth } from "@/hooks/useAuth";
import { useVehicles, useVehicleCount, VehicleFilters } from "@/hooks/useVehicles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vehicleTypeLabels: Record<string, string> = {
  carro: "Carros",
  moto: "Motos",
  caminhao: "Caminhões",
  van: "Vans",
  camionete: "Picapes",
  onibus: "Ônibus",
};

type SortOption = "relevance" | "price_asc" | "price_desc" | "year_desc" | "km_asc";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  // Get filters from URL
  const searchQuery = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("tipo") || "";
  const stateFilter = searchParams.get("estado") || "";
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSort, setSelectedSort] = useState<SortOption>("relevance");
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localCategory, setLocalCategory] = useState(categoryFilter);
  const [localState, setLocalState] = useState(stateFilter);

  // Update local state when URL changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
    setLocalCategory(categoryFilter);
    setLocalState(stateFilter);
  }, [searchQuery, categoryFilter, stateFilter]);

  // Build filters for Supabase query
  const supabaseFilters = useMemo<VehicleFilters>(() => ({
    searchTerm: searchQuery || undefined,
    category: categoryFilter as any || undefined,
    state: stateFilter || undefined,
  }), [searchQuery, categoryFilter, stateFilter]);

  // Determine sort parameters
  const sortConfig = useMemo(() => {
    switch (selectedSort) {
      case "price_asc":
        return { sortBy: "price" as const, sortOrder: "asc" as const };
      case "price_desc":
        return { sortBy: "price" as const, sortOrder: "desc" as const };
      case "year_desc":
        return { sortBy: "year_model" as const, sortOrder: "desc" as const };
      case "km_asc":
        return { sortBy: "km" as const, sortOrder: "asc" as const };
      default:
        return { sortBy: "created_at" as const, sortOrder: "desc" as const };
    }
  }, [selectedSort]);

  // Fetch vehicles from Supabase
  const { 
    data: supabaseVehicles = [], 
    isLoading: vehiclesLoading,
  } = useVehicles({
    filters: supabaseFilters,
    ...sortConfig,
    limit: 50,
  });

  // Get count
  const { data: vehicleCount = 0 } = useVehicleCount(supabaseFilters);

  // Show modal if not logged in
  const showRestrictedModal = !authLoading && !user;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (localSearchQuery.trim()) {
      params.set("q", localSearchQuery.trim());
    }
    if (localCategory && localCategory !== "all") {
      params.set("tipo", localCategory);
    }
    if (localState && localState !== "all") {
      params.set("estado", localState);
    }
    
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    setLocalCategory(value === "all" ? "" : value);
  };

  const handleStateChange = (value: string) => {
    setLocalState(value === "all" ? "" : value);
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    setLocalCategory("");
    setLocalState("");
    navigate("/veiculos");
  };
  
  const removeFilter = (filterType: "query" | "category" | "state") => {
    const params = new URLSearchParams(searchParams);
    if (filterType === "query") {
      params.delete("q");
      setLocalSearchQuery("");
    } else if (filterType === "category") {
      params.delete("tipo");
      setLocalCategory("");
    } else if (filterType === "state") {
      params.delete("estado");
      setLocalState("");
    }
    setSearchParams(params);
  };

  const selectedSortLabel = sortOptions.find(s => s.value === selectedSort)?.label || "Mais relevantes";

  // Filter mock vehicles based on search query and filters
  const filteredMockVehicles = mockVehicles.filter(vehicle => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      vehicle.title.toLowerCase().includes(query);
    
    const matchesCategory = !categoryFilter || vehicle.type === categoryFilter;
    
    // Mock vehicles have location like "São Paulo, SP" - extract state
    const vehicleState = vehicle.location?.split(", ").pop() || "";
    const matchesState = !stateFilter || vehicleState === stateFilter;
    
    return matchesSearch && matchesCategory && matchesState;
  });

  // Combine results
  const hasSupabaseVehicles = supabaseVehicles.length > 0;
  const totalResults = hasSupabaseVehicles ? vehicleCount : filteredMockVehicles.length;

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Restricted Access Modal */}
      {showRestrictedModal && (
        <RestrictedAccessModal type="veiculos" redirectPath={`/busca?q=${encodeURIComponent(searchQuery)}`} />
      )}
      
      {/* Search Header */}
      <section className="bg-gradient-to-b from-primary to-primary/95 py-8 md:py-12">
        <div className="container">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="text-white/80 hover:text-white hover:bg-white/10 mb-4 -ml-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {/* Search Title */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              {searchQuery ? (
                <>Resultados para "<span className="text-secondary">{searchQuery}</span>"</>
              ) : (
                "Buscar Veículos"
              )}
            </h1>
            <p className="text-white/70 mt-2">
              {totalResults > 0 ? (
                <>{totalResults.toLocaleString("pt-BR")} {totalResults === 1 ? "veículo encontrado" : "veículos encontrados"}</>
              ) : (
                "Nenhum veículo encontrado"
              )}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="bg-white rounded-xl p-2 shadow-xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-[2]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar marca, modelo ou ano..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="h-12 pl-10 pr-10 border-0 bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                />
                {localSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setLocalSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <Select value={localCategory || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-12 w-full sm:w-40 border-0 bg-muted/50 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white border-border z-50">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="carro">Carros</SelectItem>
                  <SelectItem value="moto">Motos</SelectItem>
                  <SelectItem value="caminhao">Caminhões</SelectItem>
                  <SelectItem value="van">Vans</SelectItem>
                  <SelectItem value="camionete">Picapes</SelectItem>
                  <SelectItem value="onibus">Ônibus</SelectItem>
                </SelectContent>
              </Select>

              {/* State Filter */}
              <Select value={localState || "all"} onValueChange={handleStateChange}>
                <SelectTrigger className="h-12 w-full sm:w-32 border-0 bg-muted/50 focus:ring-0 focus:ring-offset-0">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-white border-border z-50 max-h-60">
                  <SelectItem value="all">Todos</SelectItem>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                type="submit"
                className="h-12 px-6 bg-secondary hover:bg-secondary/90 text-white font-semibold"
              >
                <Search className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Buscar</span>
              </Button>
            </div>
          </form>

          {/* Active Filters */}
          {(searchQuery || categoryFilter || stateFilter) && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-white/60 text-sm">Filtros ativos:</span>
              {searchQuery && (
                <Badge className="bg-white/20 text-white hover:bg-white/30 cursor-pointer" onClick={() => removeFilter("query")}>
                  "{searchQuery}"
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {categoryFilter && (
                <Badge 
                  className="bg-white/20 text-white hover:bg-white/30 cursor-pointer"
                  onClick={() => removeFilter("category")}
                >
                  {vehicleTypeLabels[categoryFilter] || categoryFilter}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {stateFilter && (
                <Badge 
                  className="bg-white/20 text-white hover:bg-white/30 cursor-pointer flex items-center gap-1"
                  onClick={() => removeFilter("state")}
                >
                  <MapPin className="h-3 w-3" />
                  {stateFilter}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <main className="container py-6 flex-1">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Mostrando {hasSupabaseVehicles ? supabaseVehicles.length : filteredMockVehicles.length} de {totalResults} resultados
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Ordenar: {selectedSortLabel}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border w-48">
                {sortOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setSelectedSort(option.value as SortOption)}
                    className={selectedSort === option.value ? "bg-primary/10 text-primary" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-none h-9 w-9"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-none h-9 w-9"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {vehiclesLoading && (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-4"
          }>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden border border-border">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!vehiclesLoading && totalResults > 0 && (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-4"
          }>
            {/* Supabase Vehicles */}
            {supabaseVehicles.map((vehicle) => (
              <VehicleCardSupabase 
                key={vehicle.id} 
                vehicle={vehicle}
              />
            ))}
            
            {/* Mock Vehicles (if no Supabase results) */}
            {!hasSupabaseVehicles && filteredMockVehicles.map((vehicle) => (
              <VehicleCard 
                key={vehicle.id} 
                id={vehicle.id}
                image={vehicle.image}
                title={vehicle.title}
                price={vehicle.price}
                location={vehicle.location}
                year={vehicle.year}
                mileage={vehicle.mileage}
                transmission={vehicle.transmission}
                fuel={vehicle.fuel}
                sellerLevel={vehicle.sellerLevel}
                verified={vehicle.verified}
                certified={vehicle.certified}
                acceptsTrade={vehicle.acceptsTrade}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!vehiclesLoading && totalResults === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Não encontramos veículos para "{searchQuery}". 
              Tente ajustar sua busca ou explore nossas categorias.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={clearSearch}>
                Limpar busca
              </Button>
              <Button asChild>
                <Link to="/veiculos">Ver todos os veículos</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Load More / See All */}
        {!vehiclesLoading && totalResults > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to={`/veiculos${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}>
                Ver mais resultados
              </Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
