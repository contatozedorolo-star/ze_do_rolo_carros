import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Users,
  BarChart3,
  Download,
  ImageIcon,
  ZoomIn,
  Bell,
} from "lucide-react";

interface KYCVerification {
  id: string;
  user_id: string;
  document_type: string;
  document_number: string;
  document_front_url: string | null;
  document_back_url: string | null;
  selfie_url: string | null;
  status: "pending" | "approved" | "rejected" | "under_review";
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  profile?: {
    full_name: string | null;
    cpf: string | null;
  };
}

const AdminKYC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requests, setRequests] = useState<KYCVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<KYCVerification | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [documentUrls, setDocumentUrls] = useState<{
    front: string | null;
    back: string | null;
    selfie: string | null;
  }>({ front: null, back: null, selfie: null });
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (!user) return;

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

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
        .from("kyc_verifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, cpf")
            .eq("id", request.user_id)
            .single();

          return {
            ...request,
            profile: profileData || undefined,
          } as KYCVerification;
        })
      );

      setRequests(requestsWithProfiles);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate signed URLs for private bucket files
  const fetchDocumentUrls = async (request: KYCVerification) => {
    setLoadingUrls(true);
    setDocumentUrls({ front: null, back: null, selfie: null });

    try {
      const urls: { front: string | null; back: string | null; selfie: string | null } = {
        front: null,
        back: null,
        selfie: null,
      };

      // Generate signed URLs (valid for 1 hour)
      if (request.document_front_url) {
        const { data } = await supabase.storage
          .from("kyc-documents")
          .createSignedUrl(request.document_front_url, 3600);
        urls.front = data?.signedUrl || null;
      }

      if (request.document_back_url) {
        const { data } = await supabase.storage
          .from("kyc-documents")
          .createSignedUrl(request.document_back_url, 3600);
        urls.back = data?.signedUrl || null;
      }

      if (request.selfie_url) {
        const { data } = await supabase.storage
          .from("kyc-documents")
          .createSignedUrl(request.selfie_url, 3600);
        urls.selfie = data?.signedUrl || null;
      }

      setDocumentUrls(urls);
    } catch (error) {
      console.error("Error fetching document URLs:", error);
      toast({
        title: "Erro ao carregar documentos",
        description: "Não foi possível carregar as imagens dos documentos.",
        variant: "destructive",
      });
    } finally {
      setLoadingUrls(false);
    }
  };

  // Download document function
  const handleDownload = async (url: string | null, filename: string) => {
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível baixar o documento.",
        variant: "destructive",
      });
    }
  };

  const handleReview = async (status: "approved" | "rejected") => {
    if (!selectedRequest || !user) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("kyc_verifications")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          rejection_reason: status === "rejected" ? rejectionReason : null,
        })
        .eq("id", selectedRequest.id);

      if (error) throw error;

      toast({
        title: status === "approved" ? "Aprovado!" : "Rejeitado",
        description: status === "approved" ? "Verificação aprovada." : "Verificação rejeitada.",
      });

      setViewDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
      fetchRequests();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case "under_review":
        return <Badge className="bg-amber-500"><FileText className="w-3 h-3 mr-1" />Em Análise</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingCount = requests.filter((r) => r.status === "under_review").length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Painel KYC</h1>
          </div>
          <p className="text-muted-foreground">Gerencie verificações de identidade.</p>
        </div>

        {/* Admin Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button variant="outline" asChild>
            <Link to="/admin/notificacoes">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/usuarios">
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </Link>
          </Button>
          <Button variant="default" disabled>
            <Shield className="h-4 w-4 mr-2" />
            KYC
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>

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

        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Verificação</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma solicitação encontrada.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
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
                          <p className="font-medium">{request.profile?.full_name || "—"}</p>
                          <p className="text-sm text-muted-foreground">{request.document_number}</p>
                        </div>
                      </TableCell>
                      <TableCell className="uppercase">{request.document_type}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{new Date(request.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setRejectionReason(request.rejection_reason || "");
                            setViewDialogOpen(true);
                            fetchDocumentUrls(request);
                          }}
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

      {/* View/Review Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={(open) => {
        setViewDialogOpen(open);
        if (!open) {
          setDocumentUrls({ front: null, back: null, selfie: null });
          setImagePreview(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Revisar Verificação</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{selectedRequest.profile?.full_name || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{selectedRequest.profile?.cpf || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium uppercase">{selectedRequest.document_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número</p>
                  <p className="font-medium">{selectedRequest.document_number}</p>
                </div>
              </div>

              {/* Documents Section */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Documentos Enviados
                </h3>

                {loadingUrls ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Carregando documentos...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Document Front */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Frente do Documento</p>
                      {documentUrls.front ? (
                        <div className="relative group">
                          <img
                            src={documentUrls.front}
                            alt="Frente do documento"
                            className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setImagePreview(documentUrls.front)}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setImagePreview(documentUrls.front)}
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDownload(documentUrls.front, `doc_frente_${selectedRequest.document_number}.jpg`)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Document Back */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Verso do Documento</p>
                      {documentUrls.back ? (
                        <div className="relative group">
                          <img
                            src={documentUrls.back}
                            alt="Verso do documento"
                            className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setImagePreview(documentUrls.back)}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setImagePreview(documentUrls.back)}
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDownload(documentUrls.back, `doc_verso_${selectedRequest.document_number}.jpg`)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                          <span className="text-sm">Não enviado</span>
                        </div>
                      )}
                    </div>

                    {/* Selfie */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Selfie com Documento</p>
                      {documentUrls.selfie ? (
                        <div className="relative group">
                          <img
                            src={documentUrls.selfie}
                            alt="Selfie com documento"
                            className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setImagePreview(documentUrls.selfie)}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setImagePreview(documentUrls.selfie)}
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDownload(documentUrls.selfie, `selfie_${selectedRequest.document_number}.jpg`)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Rejection Reason (only for under_review status) */}
              {selectedRequest.status === "under_review" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Motivo da Rejeição (se aplicável)</label>
                  <Textarea
                    placeholder="Descreva o motivo da rejeição..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}

              {/* Show rejection reason if rejected */}
              {selectedRequest.status === "rejected" && selectedRequest.rejection_reason && (
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <p className="text-sm font-medium text-destructive mb-1">Motivo da rejeição:</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.rejection_reason}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            {selectedRequest?.status === "under_review" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleReview("rejected")}
                  disabled={processing}
                >
                  {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                  Rejeitar
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => handleReview("approved")}
                  disabled={processing}
                >
                  {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Aprovar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!imagePreview} onOpenChange={(open) => !open && setImagePreview(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview do documento"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setImagePreview(null)}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminKYC;
