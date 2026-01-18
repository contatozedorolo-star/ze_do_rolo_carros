import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useKYCStatus } from "@/hooks/useKYCStatus";
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
import KYCRequiredModal from "@/components/KYCRequiredModal";

interface ProposalDialogProps {
  vehicleId: string;
  vehicleTitle: string;
  vehiclePrice: number;
  sellerId: string;
  acceptsTrade: boolean;
  trigger: React.ReactNode;
}

const ProposalDialog = ({
  vehicleId,
  vehicleTitle,
  vehiclePrice,
  sellerId,
  acceptsTrade,
  trigger,
}: ProposalDialogProps) => {
  const { user } = useAuth();
  const { isVerified, kycStatus, loading: kycLoading } = useKYCStatus();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [open, setOpen] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [includeTrade, setIncludeTrade] = useState(false);
  const [tradePlusAmount, setTradePlusAmount] = useState("");

  const handleTriggerClick = (e: React.MouseEvent) => {
    // Prevent the default dialog trigger behavior
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!user) {
      navigate("/auth", { state: { from: window.location.pathname } });
      return;
    }

    // Check if KYC is approved
    if (!isVerified) {
      setShowKYCModal(true);
      return;
    }

    // All checks passed, open the dialog
    setOpen(true);
  };

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
        description: "Você não pode fazer proposta no seu próprio veículo",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(offerAmount) || 0;
    if (amount <= 0 && !includeTrade) {
      toast({
        title: "Valor inválido",
        description: "Informe um valor ou inclua um veículo para troca",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("proposals").insert({
      vehicle_id: vehicleId,
      proposer_id: user.id,
      seller_id: sellerId,
      offer_amount: amount || null,
      message: message || null,
      trade_plus_amount: includeTrade ? (parseFloat(tradePlusAmount) || 0) : null,
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
    setOfferAmount("");
    setMessage("");
    setIncludeTrade(false);
    setTradePlusAmount("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild onClick={handleTriggerClick}>
          {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fazer Proposta</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {/* Vehicle Info */}
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Veículo:</p>
              <p className="font-semibold text-foreground line-clamp-1">{vehicleTitle}</p>
              <p className="text-lg font-bold text-primary">
                R$ {vehiclePrice.toLocaleString("pt-BR")}
              </p>
            </div>

            {/* Offer Amount */}
            <div className="space-y-2">
              <Label htmlFor="offerAmount">Valor da proposta (R$)</Label>
              <Input
                id="offerAmount"
                type="number"
                placeholder="0,00"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
              />
            </div>

            {/* Trade Option */}
            {acceptsTrade && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium text-foreground">
                      Incluir veículo para troca
                    </span>
                  </div>
                  <Switch checked={includeTrade} onCheckedChange={setIncludeTrade} />
                </div>

                {includeTrade && (
                  <div className="space-y-2">
                    <Label htmlFor="tradePlusAmount">Valor adicional em dinheiro (R$)</Label>
                    <Input
                      id="tradePlusAmount"
                      type="number"
                      placeholder="0,00"
                      value={tradePlusAmount}
                      onChange={(e) => setTradePlusAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Dica: <Link to="/add-product" className="text-primary hover:underline">Cadastre seu veículo</Link> para facilitar futuras negociações.
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

      {/* KYC Required Modal */}
      <KYCRequiredModal
        isOpen={showKYCModal}
        onClose={() => setShowKYCModal(false)}
        kycStatus={kycStatus}
      />
    </>
  );
};

export default ProposalDialog;
