import { Search, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/veiculos", label: "Veículos" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">Z</span>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:block">
              Zé do <span className="text-secondary">Rolo</span>
            </span>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos, veículos, serviços..."
              className="pl-10 pr-4 h-10 w-full bg-muted/50 border-transparent focus:border-primary focus:bg-card"
            />
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
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
                <Link to="/auth">Cadastre-se Grátis</Link>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-10 pr-4 h-10 w-full bg-muted/50"
              />
            </div>
            
            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
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
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Cadastre-se Grátis</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
