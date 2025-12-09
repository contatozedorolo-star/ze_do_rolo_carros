import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";

interface ProposalDialogProps {
  productId: string;
  productTitle: string;
  productPrice: number;
  sellerId: string;
  acceptsTrade: boolean;
  trigger: React.ReactNode;
}

const ProposalDialog = ({
  productId,
  productTitle,
  productPrice,
  sellerId,
  acceptsTrade,
  trigger,
}: ProposalDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [message, setMessage] = useState("");
  const [includeTrade, setIncludeTrade] = useState(false);
  const [tradeItems, setTradeItems] = useState("");

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para enviar uma proposta",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (user.id === sellerId) {
      toast({
        title: "Ação inválida",
        description: "Você não pode fazer proposta no seu próprio produto",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(cashAmount) || 0;
    if (amount <= 0 && !includeTrade) {
      toast({
        title: "Valor inválido",
        description: "Informe um valor ou inclua itens para troca",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("proposals").insert({
      product_id: productId,
      proposer_id: user.id,
      seller_id: sellerId,
      cash_amount: amount,
      message: message || null,
      include_trade: includeTrade,
      trade_items: includeTrade ? tradeItems : null,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Erro ao enviar proposta",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Proposta enviada!",
      description: "O vendedor receberá sua proposta e poderá responder em breve.",
    });

    setOpen(false);
    setCashAmount("");
    setMessage("");
    setIncludeTrade(false);
    setTradeItems("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fazer Proposta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* Product Info */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Produto:</p>
            <p className="font-semibold text-foreground line-clamp-1">{productTitle}</p>
            <p className="text-lg font-bold text-primary">
              R$ {productPrice.toLocaleString("pt-BR")}
            </p>
          </div>

          {/* Cash Amount */}
          <div className="space-y-2">
            <Label htmlFor="cashAmount">Valor em dinheiro (R$)</Label>
            <Input
              id="cashAmount"
              type="number"
              placeholder="0,00"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
            />
          </div>

          {/* Trade Option */}
          {acceptsTrade && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    Incluir itens para troca
                  </span>
                </div>
                <Switch checked={includeTrade} onCheckedChange={setIncludeTrade} />
              </div>

              {includeTrade && (
                <div className="space-y-2">
                  <Label htmlFor="tradeItems">Descreva os itens que você oferece</Label>
                  <Textarea
                    id="tradeItems"
                    placeholder="Ex: iPhone 13 Pro em perfeito estado, com caixa e carregador..."
                    value={tradeItems}
                    onChange={(e) => setTradeItems(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Dica: <Link to="/profile" className="text-primary hover:underline">Cadastre seus itens</Link> no seu Lote para facilitar futuras negociações.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Escreva algo para o vendedor..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
            />
          </div>

          {/* Submit */}
          <Button
            variant="cta"
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Proposta"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDialog;
