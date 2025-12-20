import { useState } from "react";
import { SlidersHorizontal, Grid3X3, List, ChevronDown, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdvancedVehicleFilters } from "@/components/filters";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { vehicles } from "@/data/mockProducts";
import { sortOptions } from "@/components/filters/FilterData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Veiculos = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSort, setSelectedSort] = useState("relevance");
  const [filters, setFilters] = useState<any>({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
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

  const selectedSortLabel = sortOptions.find(s => s.value === selectedSort)?.label || "Mais relevantes";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-4">
          <span className="hover:text-primary cursor-pointer">Home</span>
          <span className="mx-2">&gt;</span>
          <span className="text-foreground font-medium">Veículos</span>
          {filters.category && filters.category !== "carro" && (
            <>
              <span className="mx-2">&gt;</span>
              <span className="text-foreground font-medium capitalize">{filters.category}s</span>
            </>
          )}
        </nav>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Veículos em todo o Brasil
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span>{vehicles.length.toLocaleString("pt-BR")} anúncios encontrados</span>
            {filters.state && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {filters.state}
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
            {filters.accepts_trade && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                Aceita Troca
              </Badge>
            )}
            {filters.ipva_paid && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                IPVA Pago
              </Badge>
            )}
            {filters.is_single_owner && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                Único Dono
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden lg:block">
            <AdvancedVehicleFilters onFiltersChange={handleFiltersChange} />
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
                    <AdvancedVehicleFilters onFiltersChange={handleFiltersChange} />
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
                      onClick={() => setSelectedSort(option.value)}
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

            {/* Vehicle Grid */}
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                : "flex flex-col gap-4"
            }>
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} {...vehicle} />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-8">
              <Button variant="outline" size="lg">
                Carregar mais veículos
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Veiculos;
