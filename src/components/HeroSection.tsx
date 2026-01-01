import { Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* 1. Security Badge - Green background */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full animate-fade-in shadow-lg"
            style={{ backgroundColor: '#29B765' }}
          >
            <Shield className="h-5 w-5 text-white" />
            <span className="text-sm font-bold text-white tracking-wide">
              🛡️ 100% SEGURO E VERIFICADO
            </span>
          </div>

          {/* 2. Headline Principal */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in" 
            style={{ animationDelay: "0.1s" }}
          >
            <span style={{ color: '#142562' }}>Negocie tudo, menos a sua </span>
            <span style={{ color: '#FF8C36' }}>segurança!</span>
          </h1>

          {/* 3. Bloco de Consultoria */}
          <p 
            className="text-lg md:text-xl max-w-3xl mx-auto animate-fade-in leading-relaxed" 
            style={{ animationDelay: "0.2s" }}
          >
            <span className="text-gray-600">Somos seus </span>
            <strong style={{ color: '#142562' }}>consultores de negócios pessoais</strong>
            <span className="text-gray-600">. Diga </span>
            <strong style={{ color: '#142562' }}>o que você tem</strong>
            <span className="text-gray-600">, </span>
            <strong style={{ color: '#142562' }}>o que você precisa</strong>
            <span className="text-gray-600"> e nós encontramos o </span>
            <strong style={{ color: '#142562' }}>negócio perfeito</strong>
            <span className="text-gray-600"> para você!</span>
          </p>

          {/* 4. Bloco de Transparência */}
          <div 
            className="py-4 px-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm inline-block animate-fade-in" 
            style={{ animationDelay: "0.25s" }}
          >
            <p className="text-lg md:text-xl text-gray-700 font-medium">
              Compra, venda e principalmente troca, com{" "}
              <span className="font-bold" style={{ color: '#29B765' }}>transparência</span>
              {" "}e{" "}
              <span className="font-bold" style={{ color: '#142562' }}>segurança</span>!
            </p>
          </div>

          {/* 5. Equação da Confiança */}
          <div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl py-5 px-8 shadow-md inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 animate-fade-in" 
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" style={{ color: '#29B765' }} />
              <span className="text-gray-700 font-medium text-sm md:text-base">Identidade verificada</span>
            </div>
            <span className="text-gray-400 font-bold text-lg">+</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" style={{ color: '#29B765' }} />
              <span className="text-gray-700 font-medium text-sm md:text-base">Produto verificado</span>
            </div>
            <span className="text-gray-400 font-bold text-lg">=</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" style={{ color: '#29B765' }} />
              <span 
                className="font-bold uppercase text-sm md:text-base tracking-wide"
                style={{ color: '#142562' }}
              >
                NEGOCIAÇÃO SEGURA
              </span>
            </div>
          </div>

          {/* 6. CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button 
              size="xl" 
              className="group text-white font-bold shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: '#FF8C36' }}
              asChild
            >
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
