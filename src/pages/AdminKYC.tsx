import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  User,
  Loader2,
} from "lucide-react";

interface VerificationRequest {
  id: string;
  user_id: string;
  document_type: string;
  document_front_url: string | null;
  document_back_url: string | null;
  selfie_url: string | null;
  status: "pending" | "submitted" | "approved" | "rejected";
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  created_at: string;
  profile?: {
    name: string;
    email: string;
    cpf: string;
  };
}

const AdminKYC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (!user) return;

      // Check if user is admin
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        console.error("Error checking admin role:", roleError);
        toast({
          title: "Erro",
          description: "Erro ao verificar permissões.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      if (!roleData) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      fetchRequests();
    };

    checkAdminAndFetch();
  }, [user, navigate, toast]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("verification_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for each request
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("name, email, cpf")
            .eq("id", request.user_id)
            .single();

          return {
            ...request,
            profile: profileData || undefined,
          } as VerificationRequest;
        })
      );

      setRequests(requestsWithProfiles);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar solicitações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status: "approved" | "rejected") => {
    if (!selectedRequest) return;

    setProcessing(true);
    try {
      // Update verification request
      const { error: requestError } = await supabase
        .from("verification_requests")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewNotes || null,
        })
        .eq("id", selectedRequest.id);

      if (requestError) throw requestError;

      // If approved, update the user's profile
      if (status === "approved") {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ is_verified: true })
          .eq("id", selectedRequest.user_id);

        if (profileError) throw profileError;
      }

      toast({
        title: status === "approved" ? "Aprovado!" : "Rejeitado",
        description:
          status === "approved"
            ? "Verificação aprovada com sucesso."
            : "Verificação rejeitada.",
      });

      setViewDialogOpen(false);
      setSelectedRequest(null);
      setReviewNotes("");
      fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar a solicitação.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-muted">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <FileText className="w-3 h-3 mr-1" />
            Enviado
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getSignedUrl = async (path: string | null) => {
    if (!path) return null;
    
    const { data } = await supabase.storage
      .from("kyc-documents")
      .createSignedUrl(path, 3600);
    
    return data?.signedUrl || null;
  };

  const openViewDialog = async (request: VerificationRequest) => {
    setSelectedRequest(request);
    setReviewNotes(request.reviewer_notes || "");
    setViewDialogOpen(true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const pendingCount = requests.filter((r) => r.status === "submitted").length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Painel Administrativo - KYC
            </h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie solicitações de verificação de identidade dos usuários.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{requests.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aguardando</p>
                  <p className="text-2xl font-bold text-amber-500">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aprovados</p>
                  <p className="text-2xl font-bold text-green-500">
                    {requests.filter((r) => r.status === "approved").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejeitados</p>
                  <p className="text-2xl font-bold text-destructive">
                    {requests.filter((r) => r.status === "rejected").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Verificação</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma solicitação de verificação encontrada.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.profile?.name || "—"}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.profile?.email || "—"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{request.profile?.cpf || "—"}</TableCell>
                      <TableCell className="capitalize">
                        {request.document_type.replace("_", " ")}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.submitted_at
                          ? new Date(request.submitted_at).toLocaleDateString("pt-BR")
                          : new Date(request.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewDialog(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Review Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Revisar Verificação - {selectedRequest?.profile?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{selectedRequest.profile?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRequest.profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{selectedRequest.profile?.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Documento</p>
                  <p className="font-medium capitalize">
                    {selectedRequest.document_type.replace("_", " ")}
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="font-semibold">Documentos Enviados</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedRequest.document_front_url && (
                    <DocumentPreview
                      label="Frente do Documento"
                      path={selectedRequest.document_front_url}
                    />
                  )}
                  {selectedRequest.document_back_url && (
                    <DocumentPreview
                      label="Verso do Documento"
                      path={selectedRequest.document_back_url}
                    />
                  )}
                  {selectedRequest.selfie_url && (
                    <DocumentPreview
                      label="Selfie com Documento"
                      path={selectedRequest.selfie_url}
                    />
                  )}
                </div>
              </div>

              {/* Review Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Notas da Revisão (opcional)
                </label>
                <Textarea
                  placeholder="Adicione observações sobre a verificação..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  disabled={
                    selectedRequest.status === "approved" ||
                    selectedRequest.status === "rejected"
                  }
                />
              </div>

              {/* Previous Notes */}
              {selectedRequest.reviewer_notes &&
                selectedRequest.status !== "submitted" && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Notas anteriores:
                    </p>
                    <p>{selectedRequest.reviewer_notes}</p>
                  </div>
                )}
            </div>
          )}

          <DialogFooter className="gap-2">
            {selectedRequest?.status === "submitted" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleReview("rejected")}
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Rejeitar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleReview("approved")}
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Aprovar
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

// Document Preview Component
const DocumentPreview = ({ label, path }: { label: string; path: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUrl = async () => {
      const { data } = await supabase.storage
        .from("kyc-documents")
        .createSignedUrl(path, 3600);
      setUrl(data?.signedUrl || null);
      setLoading(false);
    };
    loadUrl();
  }, [path]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="border rounded-lg overflow-hidden aspect-[4/3] bg-muted">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img
              src={url}
              alt={label}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-zoom-in"
            />
          </a>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <FileText className="h-8 w-8" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminKYC;