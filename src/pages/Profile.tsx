import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import KYCVerificationForm from "@/components/KYCVerificationForm";
import { 
  User, 
  Car, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  Plus,
  Edit,
  Eye,
  EyeOff,
  Camera,
  Loader2,
  Copy,
  Shield
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  is_active: boolean;
  created_at: string;
  vehicle_images: { image_url: string; is_primary: boolean }[];
}

// Helper to mask CPF
const maskCPF = (cpf: string) => {
  if (!cpf) return null;
  return "***.***.***-**";
};

// Helper to format CPF
const formatCPF = (cpf: string) => {
  if (!cpf) return null;
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Helper to mask CNPJ
const maskCNPJ = (cnpj: string) => {
  if (!cnpj) return null;
  return "**.***.***/****-**";
};

// Helper to format CNPJ
const formatCNPJ = (cnpj: string) => {
  if (!cnpj) return null;
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// Helper to mask Phone
const maskPhone = (phone: string) => {
  if (!phone) return null;
  return "(**) *****-****";
};

// Helper to format Phone
const formatPhone = (phone: string) => {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

const Profile = () => {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get initial tab from URL params
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Privacy toggles
  const [showCPF, setShowCPF] = useState(false);
  const [showCNPJ, setShowCNPJ] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    cpf: "",
    cep: "",
    city: "",
    state: "",
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 8);
    if (cleaned.length > 5) {
      return cleaned.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return cleaned;
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      const savedCep = (profile as any).cep || "";
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        cpf: profile.cpf || "",
        cep: savedCep ? formatCep(savedCep) : "",
        city: profile.city || "",
        state: profile.state || "",
      });
    }
  }, [profile]);

  const handleCepSearch = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');
    
    if (cleanedCep.length !== 8) {
      setCepError("");
      return;
    }

    setLoadingCep(true);
    setCepError("");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado");
        return;
      }

      setFormData(prev => ({
        ...prev,
        city: data.localidade || "",
        state: data.uf || "",
      }));

      toast({
        title: "Localização encontrada!",
        description: `${data.localidade}, ${data.uf}`,
      });
    } catch (error) {
      setCepError("Erro ao buscar CEP");
    } finally {
      setLoadingCep(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      const [vehiclesRes, kycRes, adminRes] = await Promise.all([
        supabase
          .from("vehicles")
          .select("id, title, brand, model, price, is_active, created_at, vehicle_images(image_url, is_primary)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("kyc_verifications")
          .select("status")
          .eq("user_id", user.id)
          .eq("status", "approved")
          .maybeSingle(),
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle()
      ]);

      if (vehiclesRes.data) {
        setVehicles(vehiclesRes.data);
      }
      setIsVerified(!!kycRes.data);
      setIsAdmin(!!adminRes.data);
      setLoadingVehicles(false);
    };

    fetchData();
  }, [user]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Foto atualizada!",
        description: "Sua foto de perfil foi salva com sucesso.",
      });

      refreshProfile();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar foto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone.replace(/\D/g, ''),
        cpf: formData.cpf.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, '') || null,
        city: formData.city || null,
        state: formData.state || null,
      })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas.",
      });
      setEditMode(false);
      refreshProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCopyEmail = async () => {
    if (!user?.email) return;
    await navigator.clipboard.writeText(user.email);
    setEmailCopied(true);
    toast({
      title: "Email copiado!",
      description: "O email foi copiado para a área de transferência.",
    });
    setTimeout(() => setEmailCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar with upload */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary-foreground">
                    {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              
              {/* Upload overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{profile.full_name || 'Usuário'}</h1>
                {isAdmin && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow cursor-default">
                          <Shield className="h-3 w-3 mr-1" />
                          Administrador
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Perfil com poderes de gestão na plataforma</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">{user?.email}</p>
                <TooltipProvider>
                  <Tooltip open={emailCopied ? true : undefined}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopyEmail}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                        title="Copiar email"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{emailCopied ? "Copiado!" : "Copiar email"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {isVerified ? (
                  <Badge variant="outline" className="border-accent text-accent">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-secondary text-secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pendente
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Meu Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="identity" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Verificar Identidade</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="gap-2">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Meus Veículos</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Seus dados cadastrados na plataforma</CardDescription>
                </div>
                <Button
                  variant={editMode ? "ghost" : "outline"}
                  size="sm"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editMode ? "Cancelar" : "Editar"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    {editMode ? (
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.full_name || 'Não informado'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-foreground font-medium">{user?.email}</p>
                  </div>

                  {/* CPF with privacy toggle */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      CPF
                      <span className="text-xs text-muted-foreground">(Privado)</span>
                    </Label>
                    {editMode ? (
                      <Input
                        value={formData.cpf}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                          const formatted = value
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                          setFormData(prev => ({ ...prev, cpf: formatted }));
                        }}
                        placeholder="000.000.000-00"
                        maxLength={14}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium">
                          {profile.cpf 
                            ? (showCPF ? formatCPF(profile.cpf) : maskCPF(profile.cpf))
                            : 'Não informado'}
                        </p>
                        {profile.cpf && (
                          <button
                            onClick={() => setShowCPF(!showCPF)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title={showCPF ? "Ocultar CPF" : "Mostrar CPF"}
                          >
                            {showCPF ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CNPJ with privacy toggle - only show if filled */}
                  {(profile as any).cnpj && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        CNPJ
                        <span className="text-xs text-muted-foreground">(Pessoa Jurídica)</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium">
                          {showCNPJ ? formatCNPJ((profile as any).cnpj) : maskCNPJ((profile as any).cnpj)}
                        </p>
                        <button
                          onClick={() => setShowCNPJ(!showCNPJ)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title={showCNPJ ? "Ocultar CNPJ" : "Mostrar CNPJ"}
                        >
                          {showCNPJ ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Phone with privacy toggle */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Telefone
                      <span className="text-xs text-muted-foreground">(Privado)</span>
                    </Label>
                    {editMode ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                          const formatted = value
                            .replace(/(\d{2})(\d)/, '($1) $2')
                            .replace(/(\d{5})(\d)/, '$1-$2');
                          setFormData(prev => ({ ...prev, phone: formatted }));
                        }}
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium">
                          {profile.phone 
                            ? (showPhone ? formatPhone(profile.phone) : maskPhone(profile.phone))
                            : 'Não informado'}
                        </p>
                        {profile.phone && (
                          <button
                            onClick={() => setShowPhone(!showPhone)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title={showPhone ? "Ocultar Telefone" : "Mostrar Telefone"}
                          >
                            {showPhone ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                </div>
              </div>

              {/* Location Fields */}
              <div className="space-y-4 pt-4 border-t border-border">
                {/* CEP Field with auto-search */}
                {editMode && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      CEP
                      <span className="text-xs text-muted-foreground">(Preencha para buscar automaticamente)</span>
                    </Label>
                    <div className="relative">
                      <Input
                        value={formData.cep}
                        onChange={(e) => {
                          const formatted = formatCep(e.target.value);
                          setFormData(prev => ({ ...prev, cep: formatted }));
                          if (formatted.replace(/\D/g, '').length === 8) {
                            handleCepSearch(formatted);
                          }
                        }}
                        placeholder="00000-000"
                        maxLength={9}
                        className={cepError ? "border-destructive" : ""}
                      />
                      {loadingCep && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    {cepError && (
                      <p className="text-sm text-destructive">{cepError}</p>
                    )}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    {editMode ? (
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value, city: "" }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="">Selecione o estado</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    ) : (
                      <p className="text-foreground font-medium">{profile.state || 'Não informado'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    {editMode ? (
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Digite sua cidade"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.city || 'Não informado'}</p>
                    )}
                  </div>
                </div>
              </div>

              {editMode && (
                <Button variant="cta" onClick={handleUpdateProfile} className="mt-4">
                  Salvar Alterações
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Meus Veículos</CardTitle>
                  <CardDescription>Veículos cadastrados para troca ou venda</CardDescription>
                </div>
                <Button variant="cta" size="sm" asChild>
                  <Link to="/add-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Veículo
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loadingVehicles ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : vehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhum veículo cadastrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece a adicionar veículos para trocar ou vender.
                    </p>
                    <Button variant="cta" asChild>
                      <Link to="/add-product">
                        <Plus className="h-4 w-4 mr-2" />
                        Cadastrar Primeiro Veículo
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((vehicle) => {
                      const primaryImage = vehicle.vehicle_images?.find(img => img.is_primary)?.image_url 
                        || vehicle.vehicle_images?.[0]?.image_url;
                      
                      return (
                        <div 
                          key={vehicle.id} 
                          className="border border-border rounded-lg overflow-hidden hover:shadow-card transition-shadow"
                        >
                          {/* Vehicle Image - clickable to view */}
                          <Link to={`/veiculos/${vehicle.id}`}>
                            <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                              {primaryImage ? (
                                <img 
                                  src={primaryImage} 
                                  alt={vehicle.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Car className="h-12 w-12 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                          </Link>
                          
                          {/* Vehicle Info */}
                          <div className="p-4">
                            <Link to={`/veiculos/${vehicle.id}`}>
                              <h3 className="font-medium text-foreground mb-1 line-clamp-1 hover:text-primary transition-colors">{vehicle.title}</h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mb-2">{vehicle.brand} {vehicle.model}</p>
                            <p className="font-bold text-primary">
                              R$ {vehicle.price.toLocaleString("pt-BR")}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <Badge variant={vehicle.is_active ? "default" : "secondary"}>
                                {vehicle.is_active ? "Disponível" : "Indisponível"}
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm"
                                asChild
                                className="gap-1.5"
                              >
                                <Link to={`/editar-anuncio/${vehicle.id}`}>
                                  <Edit className="h-3.5 w-3.5" />
                                  Editar
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Identity Verification Tab */}
          <TabsContent value="identity" className="space-y-6">
            <KYCVerificationForm />

            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>Gerencie suas preferências</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-t border-border pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={handleSignOut}
                    className="w-full sm:w-auto"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair da Conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;