import { Search, User, Menu, X, LogOut, Shield, UserCircle, Sparkles, Bot, Lock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePendingCounts } from "@/hooks/usePendingCounts";
import logo from "@/assets/logo-zedorolo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
    };

    checkAdmin();
  }, [user]);

  // Fetch pending counts for admin badge
  const { data: pendingCounts } = usePendingCounts(isAdmin);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/veiculos", label: "Veículos", protected: true },
    { href: "/tabela-fipe", label: "Tabela FIPE" },
    { href: "/como-funciona", label: "Como Funciona" },
    { href: "/blog", label: "Blog" },
    { href: "/assistente-ia", label: "Zé IA", isNew: true, protected: true },
  ];

  const handleNavClick = (e: React.MouseEvent, link: { href: string; protected?: boolean }) => {
    if (link.protected && !user) {
      e.preventDefault();
      navigate("/auth", { state: { from: link.href } });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-24 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Zé do Rolo" className="h-16 md:h-20 w-auto" />
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar marca, modelo ou ano..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-10 w-full bg-muted/50 border-transparent focus:border-primary focus:bg-card"
            />
          </div>
        </form>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5",
                link.isNew && "bg-gradient-to-r from-[#142562] to-[#1a3080] text-white hover:from-[#1a3080] hover:to-[#142562]",
                !link.isNew && location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : !link.isNew && "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.isNew && <Bot className="h-4 w-4" />}
              {link.protected && !user && <Lock className="h-3 w-3 text-muted-foreground" />}
              {link.label}
              {link.isNew && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-[#FF8C36] text-white rounded-full flex items-center gap-0.5">
                  <Sparkles className="h-2.5 w-2.5" />
                  Novo
                </span>
              )}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin/notificacoes"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                location.pathname.startsWith("/admin")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Shield className="h-4 w-4" />
              Admin
              {pendingCounts && pendingCounts.total > 0 && (
                <Badge className="ml-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">
                  {pendingCounts.total}
                </Badge>
              )}
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/profile" className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "Perfil"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground hidden lg:block">
                  {profile?.full_name?.split(" ")[0] || "Meu Perfil"}
                </span>
              </Link>
              <Button variant="cta" size="sm" className="hidden sm:flex" asChild>
                <Link to="/add-product">Anunciar</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button variant="cta" size="sm" className="hidden sm:flex" asChild>
                <Link to="/auth?mode=signup">Cadastre-se Grátis</Link>
              </Button>
            </>
          )}
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <div className="container py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 w-full bg-muted/50"
              />
            </form>
            
            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => {
                    if (link.protected && !user) {
                      e.preventDefault();
                      navigate("/auth", { state: { from: link.href } });
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                    link.isNew && "bg-gradient-to-r from-[#142562] to-[#1a3080] text-white",
                    !link.isNew && location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : !link.isNew && "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.isNew && <Bot className="h-4 w-4" />}
                  {link.protected && !user && <Lock className="h-3 w-3 text-muted-foreground" />}
                  {link.label}
                  {link.isNew && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-[#FF8C36] text-white rounded-full flex items-center gap-0.5">
                      <Sparkles className="h-2.5 w-2.5" />
                      Novo
                    </span>
                  )}
                </Link>
              ))}
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  Meu Perfil
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin/notificacoes"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                    location.pathname.startsWith("/admin")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Shield className="h-4 w-4" />
                  Painel Admin
                  {pendingCounts && pendingCounts.total > 0 && (
                    <Badge className="ml-auto h-5 min-w-5 px-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">
                      {pendingCounts.total}
                    </Badge>
                  )}
                </Link>
              )}
            </nav>
            
            {user ? (
              <div className="flex gap-2">
                <Button variant="cta" className="flex-1" asChild>
                  <Link to="/add-product" onClick={() => setMobileMenuOpen(false)}>Anunciar</Link>
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="cta" className="w-full" asChild>
                <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>Cadastre-se Grátis</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
