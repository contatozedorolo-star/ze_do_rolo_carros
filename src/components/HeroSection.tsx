import { Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs with animation */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float-medium" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-secondary/15 rounded-full blur-3xl animate-float-fast" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float-slow-reverse" />
        
        {/* Gradient waves */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/30 to-transparent animate-pulse-slow" />
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-primary/20 to-transparent" />
        </div>
        
        {/* Moving particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[10%] left-[10%] w-2 h-2 bg-secondary rounded-full animate-particle-1" />
          <div className="absolute top-[20%] left-[80%] w-1.5 h-1.5 bg-accent rounded-full animate-particle-2" />
          <div className="absolute top-[60%] left-[20%] w-2 h-2 bg-secondary rounded-full animate-particle-3" />
          <div className="absolute top-[40%] left-[70%] w-1.5 h-1.5 bg-accent rounded-full animate-particle-4" />
          <div className="absolute top-[80%] left-[50%] w-2 h-2 bg-secondary rounded-full animate-particle-5" />
          <div className="absolute top-[30%] left-[40%] w-1 h-1 bg-white rounded-full animate-particle-1" />
          <div className="absolute top-[70%] left-[85%] w-1.5 h-1.5 bg-white rounded-full animate-particle-2" />
          <div className="absolute top-[50%] left-[15%] w-1 h-1 bg-white rounded-full animate-particle-3" />
        </div>

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--primary))_70%)] opacity-60" />
      </div>

      <div className="container relative py-16 md:py-24 z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 animate-fade-in">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-accent">
              🛡️ 100% SEGURO E VERIFICADO
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in text-white" style={{ animationDelay: "0.1s" }}>
            Negocie tudo, menos a sua{" "}
            <span style={{ color: "#FF8C36" }}>segurança!</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Somos seus consultores de negócios pessoais. Diga o que você tem, o que você precisa e nós encontramos o negócio perfeito para você!
          </p>

          {/* Highlight Block */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.25s" }}>
            Compra, venda e principalmente troca, com{" "}
            <span style={{ color: "#29B765" }}>transparência</span> e segurança!
          </p>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/70 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Identidade verificada</span>
            </div>
            <span className="text-primary-foreground/50">+</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Produto verificado</span>
            </div>
            <span className="text-primary-foreground/50">=</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Negociação segura</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/auth?mode=signup">
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
      <div className="absolute bottom-0 left-0 right-0 z-10">
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
