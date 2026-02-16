import { useState, useEffect, useCallback } from "react";
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
  AlertTriangle,
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
  Area,
  AreaChart,
} from "recharts";

const SOURCE_COLORS = [
  "hsl(227, 66%, 24%)",
  "hsl(27, 100%, 61%)",
  "hsl(149, 60%, 44%)",
  "hsl(220, 9%, 46%)",
  "hsl(340, 82%, 52%)",
  "hsl(190, 90%, 40%)",
  "hsl(60, 70%, 50%)",
  "hsl(280, 60%, 50%)",
  "hsl(10, 80%, 55%)",
  "hsl(160, 50%, 45%)",
];

const DAY_NAMES: Record<string, string> = {
  "0": "Dom", "1": "Seg", "2": "Ter", "3": "Qua", "4": "Qui", "5": "Sex", "6": "Sáb",
};

function formatDate(dateStr: string) {
  // dateStr = "20260215"
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);
  const date = new Date(`${y}-${m}-${d}`);
  const dayName = DAY_NAMES[String(date.getDay())];
  return `${dayName} ${d}/${m}`;
}

interface GA4Data {
  activeUsers: number;
  vehiclePageViews: number;
  totalViews: number;
  trafficSources: { source: string; sessions: number }[];
  dailyVisits: { date: string; views: number; users: number }[];
  topPages: { path: string; title: string; views: number }[];
}

const AdminAnalytics = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [gaError, setGaError] = useState<string | null>(null);

  const [data, setData] = useState<GA4Data>({
    activeUsers: 0,
    vehiclePageViews: 0,
    totalViews: 0,
    trafficSources: [],
    dailyVisits: [],
    topPages: [],
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

  const fetchGA4Data = useCallback(async () => {
    setRefreshing(true);
    setGaError(null);
    try {
      const { data: responseData, error } = await supabase.functions.invoke(
        "ga4-analytics"
      );

      if (error) throw error;
      if (responseData?.error) throw new Error(responseData.error);

      setData(responseData as GA4Data);
      setLastUpdate(new Date());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      console.error("GA4 fetch error:", message);
      setGaError(message);
      toast({
        title: "Erro ao buscar dados do GA4",
        description: message,
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  }, [toast]);

  // Fetch on mount when admin is confirmed
  useEffect(() => {
    if (isAdmin) {
      fetchGA4Data();
    }
  }, [isAdmin, fetchGA4Data]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  // Prepare chart data
  const trafficSourceData = data.trafficSources.map((s, i) => ({
    name: s.source || "(direto)",
    value: s.sessions,
    color: SOURCE_COLORS[i % SOURCE_COLORS.length],
  }));

  const dailyVisitsData = data.dailyVisits.map((d) => ({
    day: formatDate(d.date),
    visits: d.views,
    usuarios: d.users,
  }));

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
                onClick={fetchGA4Data}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Atualizar
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Monitore o tráfego e engajamento da plataforma — dados reais do Google Analytics 4.
          </p>
        </div>

        {/* GA4 Error Banner */}
        {gaError && (
          <div className="mb-6 p-4 rounded-lg border border-destructive/50 bg-destructive/10 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-destructive">Erro na conexão com GA4</p>
              <p className="text-sm text-muted-foreground mt-1">{gaError}</p>
            </div>
          </div>
        )}

        {/* Admin Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button variant="outline" asChild>
            <Link to="/admin/dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
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
                  <p className="text-3xl font-bold text-primary">{data.activeUsers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Tempo real</p>
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
                  <p className="text-3xl font-bold text-secondary">
                    {data.totalViews.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
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
                  <p className="text-sm text-muted-foreground mb-1">Views Veículos</p>
                  <p className="text-3xl font-bold text-accent">
                    {data.vehiclePageViews.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Páginas /veiculo/</p>
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
                  <p className="text-sm text-muted-foreground mb-1">Fontes de Tráfego</p>
                  <p className="text-3xl font-bold">{data.trafficSources.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Origens distintas</p>
                </div>
                <div className="p-3 rounded-full bg-muted">
                  <Globe className="h-6 w-6 text-muted-foreground" />
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
              {trafficSourceData.length > 0 ? (
                <>
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
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {trafficSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
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
                </>
              ) : (
                <p className="text-center text-muted-foreground py-12">Sem dados disponíveis</p>
              )}
            </CardContent>
          </Card>

          {/* Daily Engagement Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Engajamento Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dailyVisitsData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyVisitsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
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
              ) : (
                <p className="text-center text-muted-foreground py-12">Sem dados disponíveis</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Páginas Mais Visitadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topPages.length > 0 ? (
              <div className="space-y-3">
                {data.topPages.map((page, index) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{page.title || page.path}</p>
                        <p className="text-sm text-muted-foreground">{page.path}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {page.views.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">visualizações</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Sem dados disponíveis</p>
            )}
          </CardContent>
        </Card>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Dados reais</strong> do Google Analytics 4 (Property: {GA4_PROPERTY_ID}). 
            Clique em "Atualizar" para obter as métricas mais recentes.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const GA4_PROPERTY_ID = "1361498115";

export default AdminAnalytics;
