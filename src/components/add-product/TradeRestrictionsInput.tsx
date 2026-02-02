import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const commonRestrictions = [
  "Motos",
  "Carros de leilão",
  "Veículos batidos",
  "Carros populares",
  "Veículos acima de 10 anos",
  "Veículos com dívidas",
  "Caminhões",
  "Veículos importados",
];

interface TradeRestrictionsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const TradeRestrictionsInput = ({ value, onChange }: TradeRestrictionsInputProps) => {
  const [customInput, setCustomInput] = useState("");

  const addRestriction = (restriction: string) => {
    if (!value.includes(restriction)) {
      onChange([...value, restriction]);
    }
  };

  const removeRestriction = (restriction: string) => {
    onChange(value.filter((r) => r !== restriction));
  };

  const handleAddCustom = () => {
    if (customInput.trim() && !value.includes(customInput.trim())) {
      onChange([...value, customInput.trim()]);
      setCustomInput("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Sugestões comuns:</p>
        <div className="flex flex-wrap gap-2">
          {commonRestrictions
            .filter((r) => !value.includes(r))
            .map((restriction) => (
              <button
                key={restriction}
                type="button"
                onClick={() => addRestriction(restriction)}
                className="px-3 py-1.5 text-xs rounded-full border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Plus className="h-3 w-3 inline mr-1" />
                {restriction}
              </button>
            ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Adicionar restrição personalizada..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustom())}
        />
        <Button type="button" variant="outline" onClick={handleAddCustom}>
          Adicionar
        </Button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Você NÃO aceita ({value.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map((restriction) => (
              <Badge
                key={restriction}
                variant="destructive"
                className="pr-1.5 flex items-center gap-1"
              >
                {restriction}
                <button
                  type="button"
                  onClick={() => removeRestriction(restriction)}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeRestrictionsInput;
