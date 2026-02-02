import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Loader2,
  Shield,
  BarChart3,
  Eye,
  Clock,
  UserPlus,
  Activity,
  Globe,
  FileText,
  TrendingUp,
  RefreshCw,
  Bell,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// Mock data - In production, this would come from Google Analytics API
const trafficSourceData = [
  { name: "Direto", value: 45, color: "hsl(227, 66%, 24%)" },
  { name: "Orgânico", value: 30, color: "hsl(27, 100%, 61%)" },
  { name: "Social", value: 15, color: "hsl(149, 60%, 44%)" },
  { name: "Referência", value: 10, color: "hsl(220, 9%, 46%)" },
];

const dailyVisitsData = [
  { day: "Seg", visits: 120, usuarios: 85 },
  { day: "Ter", visits: 150, usuarios: 102 },
  { day: "Qua", visits: 180, usuarios: 125 },
  { day: "Qui", visits: 140, usuarios: 98 },
  { day: "Sex", visits: 200, usuarios: 145 },
  { day: "Sáb", visits: 250, usuarios: 180 },
  { day: "Dom", visits: 190, usuarios: 140 },
];

const realtimeData = [
  { minute: "25min", usuarios: 12 },
  { minute: "20min", usuarios: 18 },
  { minute: "15min", usuarios: 25 },
  { minute: "10min", usuarios: 32 },
  { minute: "5min", usuarios: 28 },
  { minute: "Agora", usuarios: 35 },
];

const topPages = [
  { page: "/", name: "Página Inicial", views: 1250 },
  { page: "/veiculos", name: "Veículos", views: 890 },
  { page: "/profile", name: "Perfil", views: 456 },
  { page: "/add-product", name: "Cadastrar Veículo", views: 320 },
  { page: "/admin/kyc", name: "Admin - KYC", views: 145 },
];

const AdminAnalytics = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock metrics - In production, these would come from Google Analytics
  const [metrics, setMetrics] = useState({
    activeUsers: 35,
    totalViews: 4523,
    newUsers: 127,
    avgSessionDuration: "3:45",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkAdmin = async () => {
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
      setLoading(false);
    };

    checkAdmin();
  }, [user, navigate, toast]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setMetrics({
        activeUsers: Math.floor(Math.random() * 50) + 20,
        totalViews: Math.floor(Math.random() * 2000) + 4000,
        newUsers: Math.floor(Math.random() * 50) + 100,
        avgSessionDuration: `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      });
      setLastUpdate(new Date());
      setRefreshing(false);
      toast({
        title: "Dados atualizados",
        description: "As métricas foram atualizadas com sucesso.",
      });
    }, 1500);
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Atualizado: {lastUpdate.toLocaleTimeString("pt-BR")}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">Monitore o tráfego e engajamento da plataforma.</p>
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
          <Button variant="outline" asChild>
            <Link to="/admin/kyc">
              <Shield className="h-4 w-4 mr-2" />
              KYC
            </Link>
          </Button>
          <Button variant="default" disabled>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Main Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Usuários Ativos</p>
                  <p className="text-3xl font-bold text-primary">{metrics.activeUsers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Últimos 30 minutos</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Visualizações</p>
                  <p className="text-3xl font-bold text-secondary">{metrics.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Este mês</p>
                </div>
                <div className="p-3 rounded-full bg-secondary/10">
                  <Eye className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Novos Usuários</p>
                  <p className="text-3xl font-bold text-accent">{metrics.newUsers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Este mês</p>
                </div>
                <div className="p-3 rounded-full bg-accent/10">
                  <UserPlus className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted-foreground/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duração Média</p>
                  <p className="text-3xl font-bold">{metrics.avgSessionDuration}</p>
                  <p className="text-xs text-muted-foreground mt-1">Por sessão</p>
                </div>
                <div className="p-3 rounded-full bg-muted">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Sources - Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Origem do Tráfego
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {trafficSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {trafficSourceData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Realtime Users - Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                Usuários Ativos por Minuto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={realtimeData}>
                    <defs>
                      <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(27, 100%, 61%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(27, 100%, 61%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="minute" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="usuarios" 
                      stroke="hsl(27, 100%, 61%)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorUsuarios)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Engagement Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Engajamento Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyVisitsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="visits" 
                    name="Visualizações" 
                    fill="hsl(227, 66%, 24%)" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="usuarios" 
                    name="Usuários" 
                    fill="hsl(27, 100%, 61%)" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Páginas Mais Visitadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div 
                  key={page.page} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{page.name}</p>
                      <p className="text-sm text-muted-foreground">{page.page}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{page.views.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">visualizações</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Nota:</strong> Para métricas em tempo real do Google Analytics, é necessário configurar a integração com a API do GA4.
            Os dados exibidos são simulados para demonstração.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminAnalytics;
