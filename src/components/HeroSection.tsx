import { Shield, ArrowRight, CheckCircle, Search, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/veiculos?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/veiculos");
    }
  };

  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 animate-fade-in">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-accent">
              100% Seguro e Verificado
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Troque ou Venda seu Veículo{" "}
            <span className="text-secondary">com a Segurança do Zé do Rolo.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Intermediação ativa para carros e caminhões. Nós verificamos a procedência para você{" "}
            <strong className="text-accent">negociar sem medo</strong>.
          </p>

          {/* Vehicle Search Bar */}
          <form onSubmit={handleSearch} className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto bg-card/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <div className="relative flex-1">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Marca, Modelo ou Ano..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-card border-transparent text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
              <Button type="submit" variant="cta" size="lg" className="h-12 px-8">
                <Search className="h-5 w-5 mr-2" />
                Buscar
              </Button>
            </div>
          </form>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/70 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {[
              "Documentação Verificada",
              "Vendedores Certificados",
              "Transações Seguras",
            ].map((point) => (
              <div key={point} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/auth">
                Cadastre-se Agora
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/how-it-works">Como Funciona</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 50L48 45.7C96 41.3 192 32.7 288 35.8C384 39 480 54 576 57.2C672 60.3 768 51.7 864 48.5C960 45.3 1056 47.7 1152 52.8C1248 58 1344 66 1392 70L1440 74V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
