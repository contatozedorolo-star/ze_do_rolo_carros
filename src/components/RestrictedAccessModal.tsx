import { Bot, Shield, Sparkles, Lock, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logoZe from "@/assets/logo-zedorolo.png";

interface RestrictedAccessModalProps {
  type: "veiculos" | "assistente-ia";
  redirectPath: string;
}

const RestrictedAccessModal = ({ type, redirectPath }: RestrictedAccessModalProps) => {
  const navigate = useNavigate();

  const handleAction = () => {
    navigate("/auth", { state: { from: redirectPath } });
  };

  if (type === "assistente-ia") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with blur */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
        
        {/* Modal */}
        <div className="relative z-10 w-full max-w-lg bg-gradient-to-br from-card via-card to-primary/5 rounded-3xl shadow-2xl border border-primary/20 overflow-hidden animate-fade-in">
          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-[#FF8C36] to-accent" />
          
          {/* Content */}
          <div className="p-8 text-center">
            {/* Logo/Icon */}
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#142562] to-[#1a3080] rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center overflow-hidden">
                <img src={logoZe} alt="Zé do Rolo" className="w-16 h-16 object-contain" />
              </div>
              {/* Floating bot icon */}
              <div className="absolute -right-2 -top-2 w-10 h-10 bg-[#FF8C36] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              <span className="text-2xl">🤖</span> O Consultor Zé está te esperando!
            </h2>

            {/* Message */}
            <p className="text-muted-foreground leading-relaxed mb-6">
              Para conversar com nossa <span className="font-semibold text-foreground">Inteligência Artificial</span> e descobrir o seu 
              <span className="text-[#FF8C36] font-semibold"> match de negócio perfeito</span>, você só precisa estar logado. 
              Nossa IA analisa o estoque em tempo real para te sugerir as melhores trocas!
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Match Inteligente
              </div>
              <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                100% Gratuito
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleAction}
              className="w-full h-14 text-lg font-bold bg-[#FF8C36] hover:bg-[#e67d2e] text-white rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Entrar ou Cadastrar Agora
            </Button>

            {/* Footer note */}
            <p className="mt-4 text-xs text-muted-foreground">
              Cadastro rápido • Sem compromisso • Acesso imediato
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Veículos modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-gradient-to-br from-card via-card to-accent/5 rounded-3xl shadow-2xl border border-accent/20 overflow-hidden animate-fade-in">
        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent via-primary to-[#FF8C36]" />
        
        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full" />
            <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-accent" />
            </div>
            {/* Floating car icon */}
            <div className="absolute -right-2 -top-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            <span className="text-2xl">🛡️</span> Negócios Seguros e Transparentes
          </h2>

          {/* Message */}
          <p className="text-muted-foreground leading-relaxed mb-6">
            O acesso ao nosso <span className="font-semibold text-foreground">estoque completo de veículos verificados</span> é 
            exclusivo para membros cadastrados. Protegemos os dados de nossos anunciantes e garantimos a 
            <span className="text-accent font-semibold"> melhor experiência para você</span>. 
            <br />
            <span className="font-medium">Cadastre-se em 1 minuto!</span>
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              Veículos Verificados
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
              <Lock className="w-4 h-4" />
              Dados Protegidos
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleAction}
            className="w-full h-14 text-lg font-bold bg-[#FF8C36] hover:bg-[#e67d2e] text-white rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Quero Ver os Veículos
          </Button>

          {/* Footer note */}
          <p className="mt-4 text-xs text-muted-foreground">
            Cadastro rápido • Sem compromisso • Acesso imediato
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestrictedAccessModal;
