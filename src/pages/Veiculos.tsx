import { useState, useEffect, useMemo } from "react";
import { SlidersHorizontal, Grid3X3, List, ChevronDown, MapPin, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import { AdvancedVehicleFilters } from "@/components/filters";
import VehicleCard from "@/components/VehicleCard";
import VehicleCardSupabase from "@/components/VehicleCardSupabase";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { vehicles as mockVehicles } from "@/data/mockProducts";
import { sortOptions, brazilianStates } from "@/components/filters/FilterData";
import { useAuth } from "@/hooks/useAuth";
import { useVehicles, useVehicleCount, VehicleFilters, VehicleType } from "@/hooks/useVehicles";
import heroBackground from "@/assets/vehicles-hero-bg.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vehicleTypes = [
  { value: "carro", label: "Carros" },
  { value: "moto", label: "Motos" },
  { value: "caminhao", label: "Caminhões" },
  { value: "van", label: "Vans" },
  { value: "camionete", label: "Picapes" },
  { value: "onibus", label: "Ônibus" },
];

type SortOption = "relevance" | "price_asc" | "price_desc" | "year_desc" | "km_asc";

const Veiculos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSort, setSelectedSort] = useState<SortOption>("relevance");
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Get category and search from URL parameters
  const urlCategory = searchParams.get("tipo") as VehicleType | null;
  const urlSearch = searchParams.get("search");
  
  // Quick search state
  const [quickSearch, setQuickSearch] = useState({
    category: urlCategory || "",
    searchTerm: urlSearch || "",
    state: "",
  });

  // Build filters for Supabase query
  const supabaseFilters = useMemo<VehicleFilters>(() => {
    const category = (filters.category || urlCategory) as VehicleType | undefined;
    return {
      ...filters,
      category: category || undefined,
      searchTerm: quickSearch.searchTerm || undefined,
      state: filters.state || quickSearch.state || undefined,
    };
  }, [filters, urlCategory, quickSearch.searchTerm, quickSearch.state]);

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
    error: vehiclesError
  } = useVehicles({
    filters: supabaseFilters,
    ...sortConfig,
    limit: 50,
  });

  // Get count
  const { data: vehicleCount = 0 } = useVehicleCount(supabaseFilters);

  // Initialize filters from URL parameters
  useEffect(() => {
    if (urlCategory) {
      setFilters(prev => ({ ...prev, category: urlCategory as VehicleType }));
      setQuickSearch(prev => ({ ...prev, category: urlCategory }));
    }
    if (urlSearch) {
      setQuickSearch(prev => ({ ...prev, searchTerm: urlSearch }));
    }
  }, [urlCategory, urlSearch]);

  // Show modal if not logged in
  const showRestrictedModal = !authLoading && !user;

  const handleFiltersChange = (newFilters: any) => {
    // Convert to typed filters
    const typedFilters: VehicleFilters = {
      ...newFilters,
      category: newFilters.category as VehicleType | undefined,
    };
    setFilters(typedFilters);
    
    // Count active filters
    let count = 0;
    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key];
      if (value !== null && value !== undefined && value !== "" && 
          !(Array.isArray(value) && value.length === 0)) {
        count++;
      }
    });
    setActiveFiltersCount(count);
  };

  // Navigate to search page with all filters
  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    
    if (quickSearch.searchTerm.trim()) {
      params.set("q", quickSearch.searchTerm.trim());
    }
    if (quickSearch.category) {
      params.set("tipo", quickSearch.category);
    }
    if (quickSearch.state) {
      params.set("estado", quickSearch.state);
    }
    
    const queryString = params.toString();
    navigate(`/busca${queryString ? `?${queryString}` : ''}`);
  };

  // Update quick search when category changes and sync
  const handleCategoryChange = (value: string) => {
    setQuickSearch(prev => ({ ...prev, category: value }));
    handleFiltersChange({ ...filters, category: value as VehicleType });
  };

  const handleStateChange = (value: string) => {
    setQuickSearch(prev => ({ ...prev, state: value }));
    handleFiltersChange({ ...filters, state: value });
  };

  const selectedSortLabel = sortOptions.find(s => s.value === selectedSort)?.label || "Mais relevantes";

  // Combine Supabase vehicles with mock data for demonstration
  const hasSupabaseVehicles = supabaseVehicles.length > 0;
  
  // Filter mock vehicles based on current filters
  const filteredMockVehicles = mockVehicles.filter(vehicle => {
    const activeCategory = filters.category || urlCategory;
    if (activeCategory) {
      return vehicle.type === activeCategory;
    }
    return true;
  }).filter(vehicle => {
    if (quickSearch.searchTerm && quickSearch.searchTerm !== "") {
      return vehicle.title.toLowerCase().includes(quickSearch.searchTerm.toLowerCase());
    }
    return true;
  });

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Restricted Access Modal */}
      {showRestrictedModal && (
        <RestrictedAccessModal type="veiculos" redirectPath="/veiculos" />
      )}
      
      {/* Hero Section with Quick Search */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/95" />
        
        {/* Content */}
        <div className="relative container py-12 md:py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              O que você vai <span className="text-secondary">negociar</span> hoje?
            </h1>
            <p className="text-white/80 text-lg">
              Encontre o veículo ideal para você ou anuncie o seu
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-2">
                {/* Vehicle Type */}
                <div className="flex-1">
                  <Select 
                    value={quickSearch.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="h-12 border-0 bg-muted/50 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Tipo de veículo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border z-50">
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Term */}
                <div className="flex-[2]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Marca ou modelo (ex: Honda Civic)"
                      value={quickSearch.searchTerm}
                      onChange={(e) => setQuickSearch(prev => ({ ...prev, searchTerm: e.target.value }))}
                      className="h-12 pl-10 border-0 bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                {/* State/Location */}
                <div className="flex-1">
                  <Select 
                    value={quickSearch.state} 
                    onValueChange={handleStateChange}
                  >
                    <SelectTrigger className="h-12 border-0 bg-muted/50 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border z-50 max-h-60">
                      {brazilianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <Button 
                  onClick={handleQuickSearch}
                  className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white font-semibold shadow-cta"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container py-6">
        {/* Category Grid */}
        <CategoryGrid />

        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-4">
          <span className="hover:text-primary cursor-pointer">Home</span>
          <span className="mx-2">&gt;</span>
          <span className="text-foreground font-medium">Veículos</span>
          {(filters.category || urlCategory) && (
            <>
              <span className="mx-2">&gt;</span>
              <span className="text-foreground font-medium capitalize">
                {vehicleTypes.find(t => t.value === (filters.category || urlCategory))?.label}
              </span>
            </>
          )}
        </nav>

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {(filters.category || urlCategory) ? (
              <>
                {vehicleTypes.find(t => t.value === (filters.category || urlCategory))?.label || "Veículos"} em todo o Brasil
              </>
            ) : (
              "Veículos em todo o Brasil"
            )}
          </h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span>
              {(hasSupabaseVehicles ? vehicleCount : filteredMockVehicles.length).toLocaleString("pt-BR")} anúncios encontrados
            </span>
            {(filters.state || quickSearch.state) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {filters.state || quickSearch.state}
              </Badge>
            )}
          </p>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.brand?.map((brand: string) => (
              <Badge key={brand} variant="outline" className="bg-primary/5">
                {brand}
              </Badge>
            ))}
            {filters.acceptsTrade && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                Aceita Troca
              </Badge>
            )}
            {filters.ipvaPaid && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                IPVA Pago
              </Badge>
            )}
            {filters.singleOwner && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                Único Dono
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden lg:block">
            <AdvancedVehicleFilters 
              onFiltersChange={handleFiltersChange} 
              initialCategory={urlCategory || quickSearch.category}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden relative">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                    {activeFiltersCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md p-0 overflow-y-auto">
                  <div className="p-4">
                    <AdvancedVehicleFilters 
                      onFiltersChange={handleFiltersChange}
                      initialCategory={urlCategory || quickSearch.category}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
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
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {vehiclesLoading && (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "flex flex-col gap-4"
              }>
                {Array.from({ length: 6 }).map((_, i) => (
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

            {/* Vehicle Grid - Supabase vehicles first, then mock */}
            {!vehiclesLoading && (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "flex flex-col gap-4"
              }>
                {/* Real vehicles from Supabase */}
                {supabaseVehicles.map((vehicle) => (
                  <VehicleCardSupabase key={vehicle.id} vehicle={vehicle} />
                ))}
                
                {/* Mock vehicles for demonstration */}
                {filteredMockVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} {...vehicle} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!vehiclesLoading && supabaseVehicles.length === 0 && filteredMockVehicles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum veículo encontrado com os filtros selecionados.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setFilters({});
                    setQuickSearch({ category: "", searchTerm: "", state: "" });
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            )}

            {/* Load More */}
            {(supabaseVehicles.length > 0 || filteredMockVehicles.length > 0) && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" size="lg">
                  Carregar mais veículos
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Veiculos;
