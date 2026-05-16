import { Shield, ArrowRight, CheckCircle, Repeat, Tag, ShoppingCart, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import heroBackground from "@/assets/hero-background.gif";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* GIF de fundo em loop */}
      <img
        src={heroBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
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
              🛡️ SITE SEGURO E VERIFICADO
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-bold leading-tight animate-fade-in text-white" style={{ animationDelay: "0.1s" }}>
            <span className="block text-5xl md:text-6xl lg:text-7xl">Negocie tudo!</span>
            <span className="block text-4xl md:text-5xl lg:text-6xl mt-2">
              Menos a sua <span className="uppercase" style={{ color: "#FF8C36" }}>SEGURANÇA!</span>
            </span>
          </h1>

          {/* Consultor de Negócios - Benefits List */}
          <div className="max-w-2xl mx-auto animate-fade-in space-y-3 text-white" style={{ animationDelay: "0.2s" }}>
            <p className="text-xl md:text-2xl font-extrabold tracking-wide uppercase" style={{ color: "#FF8C36" }}>
              Consultor de Negócios
            </p>
            <ul className="space-y-2.5 text-base md:text-lg text-white/90">
              <li className="flex items-start gap-2 justify-center">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>O que você <strong className="text-white">tem</strong>? E o que você <strong className="text-white">precisa</strong>?</span>
              </li>
              <li className="flex items-start gap-2 justify-center">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>Intermediação de forma <strong className="text-white">segura e verificada</strong>.</span>
              </li>
              <li className="flex items-start gap-2 justify-center">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>Nós buscamos <strong className="text-white">O MELHOR</strong> negócio <strong className="text-white">PARA VOCÊ</strong>!</span>
              </li>
              <li className="flex items-start gap-2 justify-center">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>Troca com compensação financeira <strong className="text-white">JUSTA</strong>!</span>
              </li>
            </ul>
          </div>

          {/* Highlight Block */}
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto animate-fade-in leading-snug" style={{ animationDelay: "0.25s" }}>
            <span className="block">Compra, venda e nossa especialidade,</span>
            <span className="block text-2xl md:text-3xl font-extrabold uppercase mt-1" style={{ color: "#FF8C36" }}>TROCAS!</span>
          </p>


          {/* Action Cards Grid 2x2 */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.35s" }}>
            {[
              { top: "Quero", bottom: "trocar", href: "/add-product", Icon: Repeat },
              { top: "Quero", bottom: "vender", href: "/add-product", Icon: Tag },
              { top: "Quero", bottom: "comprar", href: "/veiculos", Icon: ShoppingCart },
              { top: "Como", bottom: "funciona?", href: "/como-funciona", Icon: HelpCircle },
            ].map(({ top, bottom, href, Icon }) => (
              <Link
                key={bottom}
                to={href}
                className="group flex flex-col items-center justify-center gap-1 py-5 px-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-accent hover:border-accent transition-all hover:scale-[1.03]"
              >
                <Icon className="h-6 w-6 text-accent group-hover:text-white transition-colors" />
                <span className="text-white text-base md:text-lg font-semibold leading-tight">{top}</span>
                <span className="text-white text-xl md:text-2xl font-extrabold uppercase leading-tight">{bottom}</span>
              </Link>
            ))}
          </div>

          {/* Trust formula */}
          <p className="text-sm md:text-base text-white/80 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <span className="font-semibold text-accent">Verificação</span>
            {" + "}
            <span className="font-semibold text-accent">Transparência</span>
            {" = "}
            <span className="font-extrabold uppercase" style={{ color: "#FF8C36" }}>Segurança</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: "0.45s" }}>
            <Button variant="hero" size="xl" className="group" asChild>
              <a href="/auth?mode=signup">
                Cadastre-se Agora
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="/how-it-works">Como Funciona</a>
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
