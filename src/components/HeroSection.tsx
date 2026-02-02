import { Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  return (
    <section 
      className="relative overflow-hidden"
      style={{ 
        backgroundImage: `url(${heroBackground})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay Gradiente: preto transparente → preto semi-sólido */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)'
        }}
      />

      <div className="container relative py-16 md:py-24">
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
            <span className="block">Negocie tudo!</span>
            <span className="block">Menos a sua <span style={{ color: "#FF8C36" }}>segurança.</span></span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <span className="block">Somos seus consultores de negócios pessoais focados em veículos em geral.</span>
            <span className="block">Diga o que você tem e o que você precisa que nós encontramos o negócio quase perfeito para você!</span>
          </p>

          {/* Highlight Block */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.25s" }}>
            Compra, venda e principalmente{" "}
            <span className="text-2xl md:text-3xl font-extrabold uppercase" style={{ color: "#FF8C36" }}>TROCA!</span>
          </p>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/70 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Verificação</span>
            </div>
            <span className="text-primary-foreground/50">+</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Transparência</span>
            </div>
            <span className="text-primary-foreground/50">=</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>SEGURANÇA</span>
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
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 50L48 45.7C96 41.3 192 32.7 288 35.8C384 39 480 54 576 57.2C672 60.3 768 51.7 864 48.5C960 45.3 1056 47.7 1152 52.8C1248 58 1344 66 1392 70L1440 74V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
