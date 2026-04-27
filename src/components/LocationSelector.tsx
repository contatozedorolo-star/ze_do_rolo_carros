import { useEffect, useState, useMemo } from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const brazilianStates = [
  { uf: "AC", name: "Acre" },
  { uf: "AL", name: "Alagoas" },
  { uf: "AP", name: "Amapá" },
  { uf: "AM", name: "Amazonas" },
  { uf: "BA", name: "Bahia" },
  { uf: "CE", name: "Ceará" },
  { uf: "DF", name: "Distrito Federal" },
  { uf: "ES", name: "Espírito Santo" },
  { uf: "GO", name: "Goiás" },
  { uf: "MA", name: "Maranhão" },
  { uf: "MT", name: "Mato Grosso" },
  { uf: "MS", name: "Mato Grosso do Sul" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "PA", name: "Pará" },
  { uf: "PB", name: "Paraíba" },
  { uf: "PR", name: "Paraná" },
  { uf: "PE", name: "Pernambuco" },
  { uf: "PI", name: "Piauí" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "RN", name: "Rio Grande do Norte" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "RO", name: "Rondônia" },
  { uf: "RR", name: "Roraima" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "SP", name: "São Paulo" },
  { uf: "SE", name: "Sergipe" },
  { uf: "TO", name: "Tocantins" },
];

// Simple in-memory cache for cities by UF
const cityCache = new Map<string, string[]>();

interface LocationSelectorProps {
  state: string;
  city: string;
  onStateChange: (uf: string) => void;
  onCityChange: (city: string) => void;
  required?: boolean;
}

export const LocationSelector = ({
  state,
  city,
  onStateChange,
  onCityChange,
  required,
}: LocationSelectorProps) => {
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [open, setOpen] = useState(false);
  const [cep, setCep] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const { toast } = useToast();

  const handleCepLookup = async () => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Digite um CEP com 8 dígitos.",
        variant: "destructive",
      });
      return;
    }
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP digitado.",
          variant: "destructive",
        });
        return;
      }
      const uf = data.uf as string;
      const cityName = data.localidade as string;
      onStateChange(uf);
      // Wait for cities to load before setting city, but city can be set immediately
      // since the cidade combobox's value isn't validated against the list
      onCityChange(cityName);
      toast({
        title: "Endereço encontrado",
        description: `${cityName} - ${uf}`,
      });
    } catch {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setLoadingCep(false);
    }
  };

  useEffect(() => {
    if (!state) {
      setCities([]);
      return;
    }

    if (cityCache.has(state)) {
      setCities(cityCache.get(state)!);
      return;
    }

    let cancelled = false;
    setLoadingCities(true);

    fetch(
      `https://servicobjs.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`
    )
      .then((r) => {
        // Fallback to the standard host if the alt host fails
        if (!r.ok) throw new Error("primary failed");
        return r.json();
      })
      .catch(() =>
        fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`
        ).then((r) => r.json())
      )
      .then((data: Array<{ nome: string }>) => {
        if (cancelled) return;
        const names = data.map((c) => c.nome).sort((a, b) => a.localeCompare(b, "pt-BR"));
        cityCache.set(state, names);
        setCities(names);
      })
      .catch(() => {
        if (!cancelled) setCities([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingCities(false);
      });

    return () => {
      cancelled = true;
    };
  }, [state]);

  const sortedStates = useMemo(
    () => [...brazilianStates].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    []
  );

  return (
    <div className="space-y-4">
      {/* CEP shortcut */}
      <div className="p-3 bg-muted/40 border border-border rounded-lg">
        <Label className="text-sm">Buscar por CEP (opcional)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={cep}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 8);
              const formatted = v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
              setCep(formatted);
            }}
            placeholder="00000-000"
            inputMode="numeric"
            maxLength={9}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCepLookup();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleCepLookup}
            disabled={loadingCep}
          >
            {loadingCep ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Preenche estado e cidade automaticamente
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Estado{required ? " *" : ""}</Label>
        <Select
          value={state}
          onValueChange={(v) => {
            onStateChange(v);
            onCityChange(""); // reset city when state changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o estado" />
          </SelectTrigger>
          <SelectContent className="bg-card max-h-72">
            {sortedStates.map((s) => (
              <SelectItem key={s.uf} value={s.uf}>
                {s.name} ({s.uf})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cidade{required ? " *" : ""}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={!state || loadingCities}
              className={cn(
                "w-full justify-between font-normal",
                !city && "text-muted-foreground"
              )}
            >
              {loadingCities ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando cidades...
                </span>
              ) : city ? (
                city
              ) : !state ? (
                "Selecione o estado primeiro"
              ) : (
                "Selecione a cidade"
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 bg-card z-50"
            style={{ width: "var(--radix-popover-trigger-width)" }}
          >
            <Command>
              <CommandInput placeholder="Buscar cidade..." />
              <CommandList>
                <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                <CommandGroup>
                  {cities.map((c) => (
                    <CommandItem
                      key={c}
                      value={c}
                      onSelect={() => {
                        onCityChange(c);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          city === c ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {c}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      </div>
    </div>
  );
};

export default LocationSelector;
