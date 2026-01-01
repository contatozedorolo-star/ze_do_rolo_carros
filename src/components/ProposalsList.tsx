import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import MessageChat from "./MessageChat";
import { 
  Check, 
  X, 
  Clock, 
  ArrowLeftRight, 
  MessageCircle,
  Package,
  User,
  ChevronDown
} from "lucide-react";

interface Proposal {
  id: string;
  product_id: string;
  proposer_id: string;
  seller_id: string;
  cash_amount: number;
  message: string | null;
  include_trade: boolean;
  trade_items: string | null;
  status: string;
  created_at: string;
  products?: {
    id: string;
    title: string;
    price_estimate: number;
  };
  proposer?: {
    name: string;
    user_level: string;
  };
  seller?: {
    name: string;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pendente", color: "bg-secondary/20 text-secondary", icon: Clock },
  accepted: { label: "Aceita", color: "bg-accent/20 text-accent", icon: Check },
  rejected: { label: "Recusada", color: "bg-destructive/20 text-destructive", icon: X },
  counter: { label: "Contraproposta", color: "bg-primary/20 text-primary", icon: MessageCircle },
  cancelled: { label: "Cancelada", color: "bg-muted text-muted-foreground", icon: X },
};

const ProposalsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [receivedProposals, setReceivedProposals] = useState<Proposal[]>([]);
  const [sentProposals, setSentProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    if (!user) return;

    setLoading(true);

    // Fetch received proposals (where user is seller)
    const { data: received } = await supabase
      .from("proposals")
      .select(`
        *,
        products:product_id (id, title, price_estimate)
      `)
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    // Fetch sent proposals (where user is proposer)
    const { data: sent } = await supabase
      .from("proposals")
      .select(`
        *,
        products:product_id (id, title, price_estimate)
      `)
      .eq("proposer_id", user.id)
      .order("created_at", { ascending: false });

    if (received) setReceivedProposals(received as unknown as Proposal[]);
    if (sent) setSentProposals(sent as unknown as Proposal[]);

    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("proposals-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "proposals",
        },
        () => {
          fetchProposals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const updateProposalStatus = async (proposalId: string, newStatus: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("proposals")
      .update({ status: newStatus })
      .eq("id", proposalId);

    if (error) {
      toast({
        title: "Erro ao atualizar proposta",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: newStatus === "accepted" ? "Proposta aceita!" : "Proposta recusada",
      description: newStatus === "accepted" 
        ? "Entre em contato com o comprador para finalizar a negociação."
        : "A proposta foi recusada.",
    });

    fetchProposals();
  };

  const cancelProposal = async (proposalId: string) => {
    const { error } = await supabase
      .from("proposals")
      .update({ status: "cancelled" })
      .eq("id", proposalId);

    if (error) {
      toast({
        title: "Erro ao cancelar proposta",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Proposta cancelada",
    });

    fetchProposals();
  };

  const renderProposalCard = (proposal: Proposal, type: "received" | "sent") => {
    const status = statusConfig[proposal.status] || statusConfig.pending;
    const StatusIcon = status.icon;
    
    const otherUserId = type === "received" ? proposal.proposer_id : proposal.seller_id;
    const otherUserName = type === "received" ? "Comprador" : "Vendedor";

    return (
      <Card key={proposal.id} className="bg-card border-border">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <Link 
                to={`/product/${proposal.product_id}`}
                className="font-semibold text-foreground hover:text-primary line-clamp-1"
              >
                {proposal.products?.title || "Produto"}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(proposal.created_at), { 
                  addSuffix: true,
                  locale: ptBR 
                })}
              </p>
            </div>
            <Badge className={status.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-4 mb-3">
            <div>
              <p className="text-xs text-muted-foreground">Oferta</p>
              <p className="text-lg font-bold text-primary">
                R$ {proposal.cash_amount.toLocaleString("pt-BR")}
              </p>
            </div>
            {proposal.products?.price_estimate && (
              <div>
                <p className="text-xs text-muted-foreground">Anunciado por</p>
                <p className="text-sm text-muted-foreground line-through">
                  R$ {proposal.products.price_estimate.toLocaleString("pt-BR")}
                </p>
              </div>
            )}
          </div>

          {/* Trade Items */}
          {proposal.include_trade && proposal.trade_items && (
            <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg mb-3">
              <div className="flex items-center gap-1 text-secondary text-xs font-medium mb-1">
                <ArrowLeftRight className="h-3 w-3" />
                Inclui troca
              </div>
              <p className="text-sm text-muted-foreground">{proposal.trade_items}</p>
            </div>
          )}

          {/* Message */}
          {proposal.message && (
            <div className="p-3 bg-muted rounded-lg mb-3">
              <p className="text-sm text-muted-foreground">{proposal.message}</p>
            </div>
          )}

          {/* Actions */}
          {proposal.status === "pending" && (
            <div className="flex gap-2 pt-2 border-t border-border">
              {type === "received" ? (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-accent hover:bg-accent/90"
                    onClick={() => updateProposalStatus(proposal.id, "accepted")}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aceitar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => updateProposalStatus(proposal.id, "rejected")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Recusar
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelProposal(proposal.id)}
                >
                  Cancelar Proposta
                </Button>
              )}
            </div>
          )}

          {/* Chat Section */}
          <Collapsible className="mt-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Abrir Chat
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <MessageChat
                proposalId={proposal.id}
                otherUserId={otherUserId}
                otherUserName={otherUserName}
              />
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  const pendingReceived = receivedProposals.filter(p => p.status === "pending").length;

  return (
    <Tabs defaultValue="received" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="received" className="relative">
          Recebidas
          {pendingReceived > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
              {pendingReceived}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="sent">Enviadas</TabsTrigger>
      </TabsList>

      <TabsContent value="received" className="mt-4 space-y-4">
        {receivedProposals.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma proposta recebida ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Quando alguém fizer uma proposta nos seus produtos, ela aparecerá aqui.
            </p>
          </div>
        ) : (
          receivedProposals.map(p => renderProposalCard(p, "received"))
        )}
      </TabsContent>

      <TabsContent value="sent" className="mt-4 space-y-4">
        {sentProposals.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Você ainda não enviou propostas</p>
            <Button variant="outline" asChild className="mt-4">
              <Link to="/veiculos">Explorar Produtos</Link>
            </Button>
          </div>
        ) : (
          sentProposals.map(p => renderProposalCard(p, "sent"))
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProposalsList;
