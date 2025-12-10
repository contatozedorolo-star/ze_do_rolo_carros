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
  Package, 
  Settings, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  Plus,
  Edit
} from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  category: string;
  price_estimate: number;
  is_for_sale: boolean;
  created_at: string;
}

const levelColors = {
  bronze: "bg-amber-600",
  prata: "bg-gray-400",
  ouro: "bg-yellow-500",
  diamante: "bg-cyan-400",
};

const levelLabels = {
  bronze: "Bronze",
  prata: "Prata",
  ouro: "Ouro",
  diamante: "Diamante",
};

const Profile = () => {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_whatsapp: "",
    pix_key: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone_whatsapp: profile.phone_whatsapp || "",
        pix_key: profile.pix_key || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("products")
        .select("id, title, category, price_estimate, is_for_sale, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoadingProducts(false);
    };

    fetchProducts();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name: formData.name,
        phone_whatsapp: formData.phone_whatsapp,
        pix_key: formData.pix_key,
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
                {profile.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${levelColors[profile.user_level]} text-primary-foreground`}>
                  {levelLabels[profile.user_level]}
                </Badge>
                {profile.is_verified ? (
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
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Meu Lote</span>
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
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-foreground font-medium">{profile.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <p className="text-foreground font-medium">
                      {profile.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    {editMode ? (
                      <Input
                        value={formData.phone_whatsapp}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone_whatsapp: e.target.value }))}
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.phone_whatsapp}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Chave PIX</Label>
                    {editMode ? (
                      <Input
                        value={formData.pix_key}
                        onChange={(e) => setFormData(prev => ({ ...prev, pix_key: e.target.value }))}
                        placeholder="Sua chave PIX"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.pix_key || "Não informada"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Nível de Confiança</Label>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-accent" />
                      <span className="font-medium capitalize">{profile.user_level}</span>
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

          {/* Products Tab (Meu Lote) */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Meu Lote</CardTitle>
                  <CardDescription>Produtos cadastrados para troca ou venda</CardDescription>
                </div>
                <Button variant="cta" size="sm" asChild>
                  <Link to="/add-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loadingProducts ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhum produto cadastrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece a adicionar produtos ao seu lote para trocar ou vender.
                    </p>
                    <Button variant="cta" asChild>
                      <Link to="/add-product">
                        <Plus className="h-4 w-4 mr-2" />
                        Cadastrar Primeiro Produto
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.id}`}
                        className="border border-border rounded-lg p-4 hover:shadow-card transition-shadow"
                      >
                        <h3 className="font-medium text-foreground mb-1">{product.title}</h3>
                        <p className="text-sm text-muted-foreground capitalize mb-2">{product.category}</p>
                        <p className="font-bold text-primary">
                          R$ {product.price_estimate.toLocaleString("pt-BR")}
                        </p>
                        <Badge variant={product.is_for_sale ? "default" : "secondary"} className="mt-2">
                          {product.is_for_sale ? "Disponível" : "Indisponível"}
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
            {/* KYC Verification Section */}
            <KYCVerificationForm />

            {/* Account Settings */}
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
