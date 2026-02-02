import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  Eye,
  EyeOff,
  Loader2,
  UserCheck,
  UserX,
  Phone,
  Mail,
  IdCard,
  Calendar,
  Shield,
  FileText,
  Copy,
  Car,
  MapPin,
  ExternalLink,
  Trash2,
  AlertTriangle,
  BarChart3,
  Gauge,
  Fuel,
  DollarSign,
  ArrowRight,
  X,
  MessageSquare,
  TrendingUp,
  Bell,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrencyShort } from "@/lib/formatters";
import { generateVehicleSlugWithId } from "@/lib/slugify";

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  cpf: string | null;
  cep: string | null;
  avatar_url: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
  email?: string;
  is_verified?: boolean;
  kyc_status?: 'pending' | 'under_review' | 'approved' | 'rejected' | null;
  vehicles_count?: number;
  is_admin?: boolean;
  // User statistics
  total_views?: number;
  proposals_received?: number;
  vehicles_sold?: number;
}

interface UserVehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  year_model: number;
  year_manufacture: number;
  km: number;
  price: number;
  fuel: string;
  transmission: string;
  is_active: boolean;
  is_sold: boolean;
  created_at: string;
  city: string | null;
  state: string | null;
  version: string | null;
  primary_image?: string;
}

// Helper functions
const formatCPF = (cpf: string | null) => {
  if (!cpf) return null;
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhone = (phone: string | null) => {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

const maskCPF = () => "***.***.***-**";
const maskPhone = () => "(**) *****-****";

const AdminUsers = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Privacy toggles for detail view
  const [showCPF, setShowCPF] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  
  // Delete user state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  // User vehicles state
  const [vehiclesDialogOpen, setVehiclesDialogOpen] = useState(false);
  const [userVehicles, setUserVehicles] = useState<UserVehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehiclesOwner, setVehiclesOwner] = useState<UserProfile | null>(null);

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
      fetchUsers();
    };

    checkAdminAndFetch();
  }, [user, navigate, toast]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user emails via admin edge function
      let emailMap: Record<string, string> = {};
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke('admin-get-users');
        if (!emailError && emailData?.emails) {
          emailMap = emailData.emails;
        }
      } catch (e) {
        console.error('Error fetching emails:', e);
      }

      // Fetch KYC verification status, admin role, and stats for each user
      const usersWithDetails = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Check KYC status - get the most recent verification record
          const { data: kycData } = await supabase
            .from("kyc_verifications")
            .select("status")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get user's vehicles
          const { data: vehiclesData } = await supabase
            .from("vehicles")
            .select("id, is_sold")
            .eq("user_id", profile.id);

          const vehicleIds = vehiclesData?.map(v => v.id) || [];
          const vehiclesSold = vehiclesData?.filter(v => v.is_sold).length || 0;

          // Get total views for all user's vehicles
          let totalViews = 0;
          if (vehicleIds.length > 0) {
            const { count: viewsCount } = await supabase
              .from("vehicle_views")
              .select("*", { count: "exact", head: true })
              .in("vehicle_id", vehicleIds);
            totalViews = viewsCount || 0;
          }

          // Get proposals received (as seller)
          const { count: proposalsReceived } = await supabase
            .from("proposals")
            .select("*", { count: "exact", head: true })
            .eq("seller_id", profile.id);

          // Check if user is admin
          const { data: adminData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id)
            .eq("role", "admin")
            .maybeSingle();

          const kycStatus = kycData?.status as 'pending' | 'under_review' | 'approved' | 'rejected' | undefined;

          return {
            ...profile,
            email: emailMap[profile.id] || undefined,
            is_verified: kycStatus === 'approved',
            kyc_status: kycStatus || null,
            vehicles_count: vehicleIds.length,
            is_admin: !!adminData,
            total_views: totalViews,
            proposals_received: proposalsReceived || 0,
            vehicles_sold: vehiclesSold,
          } as UserProfile;
        })
      );

      setUsers(usersWithDetails);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter((user) => {
      const nameMatch = user.full_name?.toLowerCase().includes(query);
      const cpfMatch = user.cpf?.includes(query.replace(/\D/g, ''));
      const phoneMatch = user.phone?.includes(query.replace(/\D/g, ''));
      const cityMatch = user.city?.toLowerCase().includes(query);
      const stateMatch = user.state?.toLowerCase().includes(query);
      
      return nameMatch || cpfMatch || phoneMatch || cityMatch || stateMatch;
    });
  }, [users, searchQuery]);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const openUserDetails = (user: UserProfile) => {
    setSelectedUser(user);
    setShowCPF(false);
    setShowPhone(false);
    setViewDialogOpen(true);
  };

  const handleCopyEmail = async (email: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast({
      title: "Email copiado!",
      description: "O email foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const openDeleteDialog = (userItem: UserProfile, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setUserToDelete(userItem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { user_id_to_delete: userToDelete.id }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Usuário excluído",
        description: data?.message || `${userToDelete.full_name || 'Usuário'} foi removido com sucesso.`,
      });

      // Remove from local state
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);

    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Fetch vehicles for a specific user
  const fetchUserVehicles = async (userItem: UserProfile) => {
    setLoadingVehicles(true);
    setVehiclesOwner(userItem);
    setVehiclesDialogOpen(true);
    setUserVehicles([]);

    try {
      // Fetch vehicles with their primary images
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", userItem.id)
        .order("created_at", { ascending: false });

      if (vehiclesError) throw vehiclesError;

      // Fetch primary images for each vehicle
      const vehiclesWithImages = await Promise.all(
        (vehiclesData || []).map(async (vehicle) => {
          const { data: imageData } = await supabase
            .from("vehicle_images")
            .select("image_url")
            .eq("vehicle_id", vehicle.id)
            .eq("is_primary", true)
            .maybeSingle();

          return {
            ...vehicle,
            primary_image: imageData?.image_url || null,
          } as UserVehicle;
        })
      );

      setUserVehicles(vehiclesWithImages);
    } catch (error) {
      console.error("Error fetching user vehicles:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os veículos do usuário.",
        variant: "destructive",
      });
    } finally {
      setLoadingVehicles(false);
    }
  };

  const navigateToVehicle = (vehicle: UserVehicle) => {
    const slug = generateVehicleSlugWithId(
      vehicle.id,
      vehicle.brand,
      vehicle.model,
      vehicle.year_model,
      vehicle.version
    );
    navigate(`/veiculo/${slug}`);
  };

  const fuelLabels: Record<string, string> = {
    gasolina: "Gasolina",
    etanol: "Etanol",
    flex: "Flex",
    diesel: "Diesel",
    eletrico: "Elétrico",
    hibrido: "Híbrido",
    gnv: "GNV",
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const verifiedCount = users.filter((u) => u.kyc_status === 'approved').length;
  const underReviewCount = users.filter((u) => u.kyc_status === 'under_review' || u.kyc_status === 'pending').length;
  const withVehiclesCount = users.filter((u) => (u.vehicles_count || 0) > 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Painel de Usuários</h1>
          </div>
          <p className="text-muted-foreground">Gerencie todos os usuários cadastrados na plataforma.</p>
        </div>

        {/* Admin Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button variant="outline" asChild>
            <Link to="/admin/notificacoes">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Link>
          </Button>
          <Button variant="default" disabled>
            <Users className="h-4 w-4 mr-2" />
            Usuários
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Usuários</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verificados</p>
                  <p className="text-2xl font-bold text-green-500">{verifiedCount}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Análise</p>
                  <p className="text-2xl font-bold text-orange-500">{underReviewCount}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-400/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-red-400">{users.length - verifiedCount - underReviewCount}</p>
                </div>
                <UserX className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Com Veículos</p>
                  <p className="text-2xl font-bold text-primary">{withVehiclesCount}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF, telefone, cidade ou estado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Usuários Cadastrados
              {searchQuery && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({filteredUsers.length} resultado{filteredUsers.length !== 1 ? 's' : ''})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{searchQuery ? "Nenhum usuário encontrado." : "Nenhum usuário cadastrado."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Veículos</TableHead>
                      <TableHead>Estatísticas</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((userItem) => (
                      <TableRow key={userItem.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={userItem.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {getInitials(userItem.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openUserDetails(userItem)}
                                  className="font-medium hover:text-primary hover:underline transition-colors text-left"
                                >
                                  {userItem.full_name || "Sem nome"}
                                </button>
                                {userItem.is_admin && (
                                  <Badge className="bg-[#142562] text-white text-[10px] px-1.5 py-0">
                                    ADMIN
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {userItem.cpf ? maskCPF() : "CPF não informado"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {userItem.email || "—"}
                            </span>
                            {userItem.email && (
                              <TooltipProvider>
                                <Tooltip open={copiedEmail === userItem.email ? true : undefined}>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => handleCopyEmail(userItem.email!, e)}
                                      className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{copiedEmail === userItem.email ? "Copiado!" : "Copiar email"}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {userItem.state ? (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium">{userItem.state}</span>
                              {userItem.city && (
                                <span className="text-xs text-muted-foreground">
                                  ({userItem.city})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {userItem.kyc_status === 'approved' ? (
                            <Badge className="bg-green-500">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Verificado
                            </Badge>
                          ) : userItem.kyc_status === 'under_review' || userItem.kyc_status === 'pending' ? (
                            <Badge className="bg-orange-500 text-white">
                              <Shield className="w-3 h-3 mr-1" />
                              Análise
                            </Badge>
                          ) : (
                            <Badge className="bg-red-400 text-white">
                              <UserX className="w-3 h-3 mr-1" />
                              Pendente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{userItem.vehicles_count || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Eye className="h-3 w-3" />
                                    <span>{userItem.total_views || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{userItem.proposals_received || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{userItem.vehicles_sold || 0}</span>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs space-y-1">
                                  <p><Eye className="h-3 w-3 inline mr-1" /> Visualizações: {userItem.total_views || 0}</p>
                                  <p><MessageSquare className="h-3 w-3 inline mr-1" /> Propostas recebidas: {userItem.proposals_received || 0}</p>
                                  <p><TrendingUp className="h-3 w-3 inline mr-1" /> Veículos vendidos: {userItem.vehicles_sold || 0}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          {new Date(userItem.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUserDetails(userItem)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            
                            {/* Delete button - disabled for self */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                                      onClick={(e) => openDeleteDialog(userItem, e)}
                                      disabled={userItem.id === user?.id}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {userItem.id === user?.id 
                                    ? "Você não pode excluir seu próprio perfil" 
                                    : "Excluir usuário"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* User Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 overflow-y-auto flex-1 pr-2">
              {/* User Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(selectedUser.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{selectedUser.full_name || "Sem nome"}</h3>
                    {selectedUser.is_admin && (
                      <Badge className="bg-[#142562] text-white text-[10px] px-1.5">
                        ADMIN
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {selectedUser.kyc_status === 'approved' ? (
                      <Badge className="bg-green-500">Verificado</Badge>
                    ) : selectedUser.kyc_status === 'under_review' || selectedUser.kyc_status === 'pending' ? (
                      <Badge className="bg-orange-500 text-white">Análise</Badge>
                    ) : (
                      <Badge className="bg-red-400 text-white">Pendente</Badge>
                    )}
                    <Badge variant="outline">
                      <Car className="w-3 h-3 mr-1" />
                      {selectedUser.vehicles_count || 0} veículo(s)
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User Statistics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <Eye className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xl font-bold text-primary">{selectedUser.total_views || 0}</p>
                  <p className="text-xs text-muted-foreground">Visualizações</p>
                </div>
                <div className="text-center p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                  <MessageSquare className="h-5 w-5 mx-auto text-secondary mb-1" />
                  <p className="text-xl font-bold text-secondary">{selectedUser.proposals_received || 0}</p>
                  <p className="text-xs text-muted-foreground">Propostas</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <TrendingUp className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl font-bold text-green-600">{selectedUser.vehicles_sold || 0}</p>
                  <p className="text-xs text-muted-foreground">Vendidos</p>
                </div>
              </div>

              {/* User Info Grid */}
              <div className="space-y-3">
                {/* CPF with toggle */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <IdCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">CPF</p>
                      <p className="font-medium">
                        {selectedUser.cpf 
                          ? (showCPF ? formatCPF(selectedUser.cpf) : maskCPF())
                          : "Não informado"}
                      </p>
                    </div>
                  </div>
                  {selectedUser.cpf && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCPF(!showCPF)}
                    >
                      {showCPF ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                </div>

                {/* Phone with toggle */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">
                        {selectedUser.phone 
                          ? (showPhone ? formatPhone(selectedUser.phone) : maskPhone())
                          : "Não informado"}
                      </p>
                    </div>
                  </div>
                  {selectedUser.phone && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPhone(!showPhone)}
                    >
                      {showPhone ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                </div>

                {/* Email with copy - always visible */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="font-medium truncate">
                        {selectedUser.email || "Não disponível"}
                      </p>
                    </div>
                  </div>
                  {selectedUser.email && (
                    <TooltipProvider>
                      <Tooltip open={copiedEmail === selectedUser.email ? true : undefined}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyEmail(selectedUser.email!)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copiedEmail === selectedUser.email ? "Copiado!" : "Copiar e-mail"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {/* CEP */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">CEP</p>
                    <p className="font-medium">
                      {selectedUser.cep 
                        ? selectedUser.cep.replace(/(\d{5})(\d{3})/, '$1-$2')
                        : "Não informado"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Localização</p>
                    <p className="font-medium">
                      {selectedUser.state 
                        ? (selectedUser.city 
                            ? `${selectedUser.city}, ${selectedUser.state}`
                            : selectedUser.state)
                        : "Não informado"}
                    </p>
                  </div>
                </div>

                {/* Registration Date */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                    <p className="font-medium">
                      {new Date(selectedUser.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {(selectedUser.vehicles_count || 0) > 0 && (
                <div className="pt-2 border-t">
                  <Button
                    variant="cta"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setViewDialogOpen(false);
                      fetchUserVehicles(selectedUser);
                    }}
                  >
                    <Car className="h-4 w-4 mr-2" />
                    Ver Veículos Cadastrados
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left">
              Tem certeza que deseja excluir permanentemente o perfil de{" "}
              <strong className="text-foreground">{userToDelete?.full_name || "este usuário"}</strong>?
              <br /><br />
              <span className="text-destructive font-medium">
                Esta ação não pode ser desfeita
              </span>{" "}
              e removerá todos os dados e veículos associados a este usuário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Confirmar Exclusão
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Vehicles Dialog */}
      <Dialog open={vehiclesDialogOpen} onOpenChange={setVehiclesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Veículos de {vehiclesOwner?.full_name || "Usuário"}
            </DialogTitle>
            <DialogDescription>
              {loadingVehicles 
                ? "Carregando veículos..." 
                : `${userVehicles.length} veículo(s) cadastrado(s)`}
            </DialogDescription>
          </DialogHeader>

          {loadingVehicles ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userVehicles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum veículo cadastrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Vehicle Image */}
                  <div className="relative w-full sm:w-40 h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                    {vehicle.primary_image ? (
                      <img
                        src={vehicle.primary_image}
                        alt={vehicle.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {vehicle.is_sold && (
                        <Badge className="bg-red-500 text-white text-xs">Vendido</Badge>
                      )}
                      {!vehicle.is_active && !vehicle.is_sold && (
                        <Badge variant="secondary" className="text-xs">Inativo</Badge>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground line-clamp-1">
                          {vehicle.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.brand} {vehicle.model} {vehicle.version || ""}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary shrink-0">
                        {formatCurrencyShort(vehicle.price)}
                      </p>
                    </div>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {vehicle.year_manufacture === vehicle.year_model 
                            ? vehicle.year_model 
                            : `${vehicle.year_manufacture}/${vehicle.year_model}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="h-3.5 w-3.5" />
                        <span>{vehicle.km.toLocaleString("pt-BR")} km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-3.5 w-3.5" />
                        <span>{fuelLabels[vehicle.fuel] || vehicle.fuel}</span>
                      </div>
                      {vehicle.city && vehicle.state && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{vehicle.city}, {vehicle.state}</span>
                        </div>
                      )}
                    </div>

                    {/* Created Date & Action */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        Cadastrado em {new Date(vehicle.created_at).toLocaleDateString("pt-BR")}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateToVehicle(vehicle)}
                      >
                        Ver Anúncio
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminUsers;