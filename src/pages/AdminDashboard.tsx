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
  DialogDescription,
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
  Bell,
  Car,
  ImageIcon,
  ZoomIn,
  Download,
  LayoutDashboard,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

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

interface PendingVehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  year_model: number;
  user_id: string;
  created_at: string;
  primary_image?: string;
  profile?: {
    full_name: string | null;
  };
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Stats
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);

  // KYC
  const [kycRequests, setKycRequests] = useState<KYCVerification[]>([]);
  const [selectedKYC, setSelectedKYC] = useState<KYCVerification | null>(null);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [documentUrls, setDocumentUrls] = useState<{
    front: string | null;
    back: string | null;
    selfie: string | null;
  }>({ front: null, back: null, selfie: null });
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Vehicles
  const [pendingVehicles, setPendingVehicles] = useState<PendingVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<PendingVehicle | null>(null);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);

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
      fetchData();
    };

    checkAdminAndFetch();
  }, [user, navigate, toast]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch total users count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      setTotalUsers(usersCount || 0);

      // Fetch total vehicles count
      const { count: vehiclesCount } = await supabase
        .from("vehicles")
        .select("id", { count: "exact", head: true });

      setTotalVehicles(vehiclesCount || 0);

      // Fetch pending KYC requests (under_review)
      const { data: kycData, error: kycError } = await supabase
        .from("kyc_verifications")
        .select("*")
        .eq("status", "under_review")
        .order("created_at", { ascending: false });

      if (kycError) throw kycError;

      const kycWithProfiles = await Promise.all(
        (kycData || []).map(async (request) => {
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

      setKycRequests(kycWithProfiles);

      // Fetch pending vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("vehicles")
        .select(`
          id, title, brand, model, price, year_model, user_id, created_at,
          vehicle_images (image_url, is_primary)
        `)
        .eq("moderation_status", "pending")
        .order("created_at", { ascending: false });

      if (vehiclesError) throw vehiclesError;

      const vehiclesWithProfiles = await Promise.all(
        (vehiclesData || []).map(async (vehicle: any) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", vehicle.user_id)
            .single();

          const images = vehicle.vehicle_images || [];
          const primaryImage =
            images.find((img: any) => img.is_primary)?.image_url ||
            images[0]?.image_url ||
            "/placeholder.svg";

          return {
            id: vehicle.id,
            title: vehicle.title,
            brand: vehicle.brand,
            model: vehicle.model,
            price: vehicle.price,
            year_model: vehicle.year_model,
            user_id: vehicle.user_id,
            created_at: vehicle.created_at,
            primary_image: primaryImage,
            profile: profileData || undefined,
          } as PendingVehicle;
        })
      );

      setPendingVehicles(vehiclesWithProfiles);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Erro ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // KYC document URLs
  const fetchDocumentUrls = async (request: KYCVerification) => {
    setLoadingUrls(true);
    setDocumentUrls({ front: null, back: null, selfie: null });

    try {
      const urls: { front: string | null; back: string | null; selfie: string | null } = {
        front: null,
        back: null,
        selfie: null,
      };

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
    } finally {
      setLoadingUrls(false);
    }
  };

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
    }
  };

  const handleKYCReview = async (status: "approved" | "rejected") => {
    if (!selectedKYC || !user) return;

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
        .eq("id", selectedKYC.id);

      if (error) throw error;

      toast({
        title: status === "approved" ? "Identidade Aprovada!" : "Identidade Rejeitada",
        description:
          status === "approved"
            ? "O usuário agora está verificado. E-mail de conta aprovada enviado."
            : "O usuário foi notificado por e-mail.",
      });

      setKycDialogOpen(false);
      setSelectedKYC(null);
      setRejectionReason("");
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Erro ao processar", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleVehicleApprove = async () => {
    if (!selectedVehicle) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({ moderation_status: "approved" })
        .eq("id", selectedVehicle.id);

      if (error) throw error;

      toast({
        title: "Anúncio Aprovado!",
        description: "O veículo agora está visível na plataforma. E-mail de aprovação enviado.",
      });

      setVehicleDialogOpen(false);
      setSelectedVehicle(null);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Erro ao processar", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleVehicleReject = async () => {
    if (!selectedVehicle) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", selectedVehicle.id);

      if (error) throw error;

      toast({
        title: "Anúncio Rejeitado",
        description: "O anúncio foi removido da plataforma.",
      });

      setVehicleDialogOpen(false);
      setSelectedVehicle(null);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Erro ao processar", variant: "destructive" });
    } finally {
      setProcessing(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
          </div>
          <p className="text-muted-foreground">
            Visão geral da plataforma Zé do Rolo.
          </p>
        </div>

        {/* Admin Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button variant="default" disabled>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
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
          <Button variant="outline" asChild>
            <Link to="/admin/kyc">
              <Shield className="h-4 w-4 mr-2" />
              KYC
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Usuários</p>
                  <p className="text-3xl font-bold text-primary">{totalUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Veículos Cadastrados</p>
                  <p className="text-3xl font-bold text-secondary">{totalVehicles}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Car className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">KYC Pendentes</p>
                  <p className="text-3xl font-bold text-amber-500">{kycRequests.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Anúncios Pendentes</p>
                  <p className="text-3xl font-bold text-accent">{pendingVehicles.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KYC Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Verificações de Identidade (Em Análise)
              {kycRequests.length > 0 && (
                <Badge className="bg-amber-500 text-white">{kycRequests.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kycRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>Nenhuma verificação pendente.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kycRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.profile?.full_name || "—"}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.document_number}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="uppercase">{request.document_type}</TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedKYC(request);
                              setRejectionReason("");
                              setKycDialogOpen(true);
                              fetchDocumentUrls(request);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={async () => {
                              setProcessing(true);
                              try {
                                const { error } = await supabase
                                  .from("kyc_verifications")
                                  .update({
                                    status: "approved" as const,
                                    reviewed_at: new Date().toISOString(),
                                    reviewed_by: user!.id,
                                    rejection_reason: null,
                                  })
                                  .eq("id", request.id);
                                if (error) throw error;
                                toast({
                                  title: "Identidade Aprovada!",
                                  description: "E-mail de conta aprovada enviado.",
                                });
                                fetchData();
                              } catch (err) {
                                console.error(err);
                                toast({ title: "Erro ao aprovar", variant: "destructive" });
                              } finally {
                                setProcessing(false);
                              }
                            }}
                            disabled={processing}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedKYC(request);
                              setRejectionReason("");
                              setKycDialogOpen(true);
                              fetchDocumentUrls(request);
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Vehicles Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-accent" />
              Anúncios Pendentes de Moderação
              {pendingVehicles.length > 0 && (
                <Badge className="bg-accent text-accent-foreground">{pendingVehicles.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingVehicles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>Nenhum anúncio pendente.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Anunciante</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={vehicle.primary_image}
                            alt={vehicle.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{vehicle.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {vehicle.brand} {vehicle.model} · {vehicle.year_model}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.profile?.full_name || "—"}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(vehicle.price)}
                      </TableCell>
                      <TableCell>
                        {new Date(vehicle.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setVehicleDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Validar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setVehicleDialogOpen(true);
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* KYC Review Dialog */}
      <Dialog
        open={kycDialogOpen}
        onOpenChange={(open) => {
          setKycDialogOpen(open);
          if (!open) {
            setDocumentUrls({ front: null, back: null, selfie: null });
            setImagePreview(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Revisar Verificação de Identidade</DialogTitle>
            <DialogDescription>
              Analise os documentos enviados pelo usuário.
            </DialogDescription>
          </DialogHeader>

          {selectedKYC && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{selectedKYC.profile?.full_name || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{selectedKYC.profile?.cpf || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium uppercase">{selectedKYC.document_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número</p>
                  <p className="font-medium">{selectedKYC.document_number}</p>
                </div>
              </div>

              {/* Documents */}
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
                    {/* Front */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Frente</p>
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
                              onClick={() => handleDownload(documentUrls.front, "documento-frente")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                          Não enviado
                        </div>
                      )}
                    </div>

                    {/* Back */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Verso</p>
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
                              onClick={() => handleDownload(documentUrls.back, "documento-verso")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                          Não enviado
                        </div>
                      )}
                    </div>

                    {/* Selfie */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Selfie</p>
                      {documentUrls.selfie ? (
                        <div className="relative group">
                          <img
                            src={documentUrls.selfie}
                            alt="Selfie"
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
                              onClick={() => handleDownload(documentUrls.selfie, "selfie")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                          Não enviado
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Rejection Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Motivo da rejeição (se aplicável)</label>
                <Textarea
                  placeholder="Descreva o motivo da rejeição..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleKYCReview("rejected")}
                  disabled={processing || !rejectionReason.trim()}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Rejeitar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleKYCReview("approved")}
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Aprovar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogHeader>
            <DialogTitle>Visualização do Documento</DialogTitle>
          </DialogHeader>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview do documento"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Vehicle Approval Dialog */}
      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Ação</DialogTitle>
            <DialogDescription>
              Deseja aprovar ou rejeitar este anúncio?
            </DialogDescription>
          </DialogHeader>

          {selectedVehicle && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <img
                  src={selectedVehicle.primary_image}
                  alt={selectedVehicle.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">{selectedVehicle.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedVehicle.brand} {selectedVehicle.model} · {selectedVehicle.year_model}
                  </p>
                  <p className="text-sm font-medium">{formatCurrency(selectedVehicle.price)}</p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="destructive"
                  onClick={handleVehicleReject}
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Rejeitar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleVehicleApprove}
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Aprovar Anúncio
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
