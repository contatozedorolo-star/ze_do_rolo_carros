import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Plus, 
  MessageSquare, 
  TrendingUp, 
  Shield, 
  Star,
  ArrowRight,
  Eye
} from "lucide-react";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      icon: Plus,
      title: "Anunciar Produto",
      description: "Cadastre um novo item para venda ou troca",
      href: "/add-product",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Package,
      title: "Meu Lote",
      description: "Gerencie seus produtos cadastrados",
      href: "/profile",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: MessageSquare,
      title: "Propostas",
      description: "Veja propostas recebidas e enviadas",
      href: "/profile",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Eye,
      title: "Explorar",
      description: "Descubra produtos disponíveis",
      href: "/veiculos",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  ];

  const stats = [
    { label: "Produtos Cadastrados", value: "0", icon: Package },
    { label: "Propostas Recebidas", value: "0", icon: MessageSquare },
    { label: "Visualizações", value: "0", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Olá, {profile?.name?.split(' ')[0] || 'Usuário'}!
            </h1>
            {profile?.is_verified ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/30">
                <Shield className="h-3 w-3 text-accent" />
                <span className="text-xs font-medium text-accent">Verificado</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 border border-secondary/30">
                <Star className="h-3 w-3 text-secondary" />
                <span className="text-xs font-medium text-secondary">Pendente</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel. Gerencie seus produtos e negociações.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-4`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Verification CTA */}
        {!profile?.is_verified && (
          <Card className="bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/30">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Complete sua Verificação</h3>
                  <p className="text-sm text-muted-foreground">
                    Verifique sua identidade para desbloquear todos os recursos e aumentar sua credibilidade.
                  </p>
                </div>
              </div>
              <Button variant="cta" className="shrink-0 group" asChild>
                <Link to="/profile">
                  Verificar Agora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
