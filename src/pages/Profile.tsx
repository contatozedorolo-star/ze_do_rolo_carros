import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Settings, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  Plus,
  Edit
} from "lucide-react";
import { Link } from "react-router-dom";

interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  is_active: boolean;
  created_at: string;
}

const Profile = () => {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    cpf: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        cpf: profile.cpf || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      const [vehiclesRes, kycRes] = await Promise.all([
        supabase
          .from("vehicles")
          .select("id, title, brand, model, price, is_active, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("kyc_verifications")
          .select("status")
          .eq("user_id", user.id)
          .eq("status", "approved")
          .maybeSingle()
      ]);

      if (vehiclesRes.data) {
        setVehicles(vehiclesRes.data);
      }
      setIsVerified(!!kycRes.data);
      setLoadingVehicles(false);
    };

    fetchData();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        cpf: formData.cpf.replace(/\D/g, ''),
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
            <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">
                {profile.full_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{profile.full_name || 'Usuário'}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
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
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Meu Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="gap-2">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Meus Veículos</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurações</span>
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

                  <div className="space-y-2">
                    <Label>CPF</Label>
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
                      <p className="text-foreground font-medium">
                        {profile.cpf ? profile.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 'Não informado'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    {editMode ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.phone || 'Não informado'}</p>
                    )}
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
                    {vehicles.map((vehicle) => (
                      <Link 
                        key={vehicle.id} 
                        to={`/veiculos/${vehicle.id}`}
                        className="border border-border rounded-lg p-4 hover:shadow-card transition-shadow"
                      >
                        <h3 className="font-medium text-foreground mb-1">{vehicle.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{vehicle.brand} {vehicle.model}</p>
                        <p className="font-bold text-primary">
                          R$ {vehicle.price.toLocaleString("pt-BR")}
                        </p>
                        <Badge variant={vehicle.is_active ? "default" : "secondary"} className="mt-2">
                          {vehicle.is_active ? "Disponível" : "Indisponível"}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
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
