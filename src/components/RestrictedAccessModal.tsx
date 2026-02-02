import { Bot, Shield, Sparkles, Lock, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <motion.div 
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.1 } }}
          />
          
          {/* Modal */}
          <motion.div 
            className="relative z-10 w-full max-w-lg bg-gradient-to-br from-card via-card to-primary/5 rounded-3xl shadow-2xl border border-primary/20 overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 25,
                mass: 0.8,
                delay: 0.1
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              y: 20,
              transition: { duration: 0.2 }
            }}
          >
            {/* Decorative top gradient */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-[#FF8C36] to-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            />
            
            {/* Content */}
            <div className="p-8 text-center">
              {/* Logo/Icon */}
              <motion.div 
                className="relative mx-auto w-24 h-24 mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: {
                    type: "spring" as const,
                    stiffness: 200,
                    damping: 15,
                    delay: 0.3
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#142562] to-[#1a3080] rounded-full" />
                <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center overflow-hidden">
                  <img src={logoZe} alt="Zé do Rolo" className="w-16 h-16 object-contain" />
                </div>
                {/* Floating bot icon */}
                <motion.div 
                  className="absolute -right-2 -top-2 w-10 h-10 bg-[#FF8C36] rounded-full flex items-center justify-center shadow-lg"
                  initial={{ scale: 0, x: 20, y: -20 }}
                  animate={{ 
                    scale: 1, 
                    x: 0, 
                    y: 0,
                    transition: {
                      type: "spring" as const,
                      stiffness: 400,
                      damping: 12,
                      delay: 0.5
                    }
                  }}
                >
                  <Bot className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h2 
                className="text-2xl md:text-3xl font-bold text-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring" as const,
                    stiffness: 100,
                    damping: 12,
                    delay: 0.4
                  }
                }}
              >
                <span className="text-2xl">🤖</span> O Consultor Zé está te esperando!
              </motion.h2>

              {/* Message */}
              <motion.p 
                className="text-muted-foreground leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring" as const,
                    stiffness: 100,
                    damping: 12,
                    delay: 0.5
                  }
                }}
              >
                Para conversar com nossa <span className="font-semibold text-foreground">Inteligência Artificial</span> e descobrir o seu 
                <span className="text-[#FF8C36] font-semibold"> match de negócio perfeito</span>, você só precisa estar logado. 
                Nossa IA analisa o estoque em tempo real para te sugerir as melhores trocas!
              </motion.p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <motion.div 
                  className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: {
                      type: "spring" as const,
                      stiffness: 200,
                      damping: 15,
                      delay: 0.6
                    }
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Match Inteligente
                </motion.div>
                <motion.div 
                  className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: {
                      type: "spring" as const,
                      stiffness: 200,
                      damping: 15,
                      delay: 0.7
                    }
                  }}
                >
                  <Shield className="w-4 h-4" />
                  100% Gratuito
                </motion.div>
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring" as const,
                    stiffness: 150,
                    damping: 15,
                    delay: 0.8
                  }
                }}
                whileHover={{ scale: 1.03, transition: { type: "spring" as const, stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  onClick={handleAction}
                  className="w-full h-14 text-lg font-bold bg-[#FF8C36] hover:bg-[#e67d2e] text-white rounded-xl shadow-lg shadow-orange-500/30"
                >
                  Entrar ou Cadastrar Agora
                </Button>
              </motion.div>

              {/* Footer note */}
              <motion.p 
                className="mt-4 text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Cadastro rápido • Sem compromisso • Acesso imediato
              </motion.p>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // Veículos modal
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with blur */}
        <motion.div 
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.1 } }}
        />
        
        {/* Modal */}
        <motion.div 
          className="relative z-10 w-full max-w-lg bg-gradient-to-br from-card via-card to-accent/5 rounded-3xl shadow-2xl border border-accent/20 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
              type: "spring" as const,
              stiffness: 300,
              damping: 25,
              mass: 0.8,
              delay: 0.1
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.9,
            y: 20,
            transition: { duration: 0.2 }
          }}
        >
          {/* Decorative top gradient */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent via-primary to-[#FF8C36]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          />
          
          {/* Content */}
          <div className="p-8 text-center">
            {/* Icon */}
            <motion.div 
              className="relative mx-auto w-24 h-24 mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                transition: {
                  type: "spring" as const,
                  stiffness: 200,
                  damping: 15,
                  delay: 0.3
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full" />
              <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center">
                <Shield className="w-12 h-12 text-accent" />
              </div>
              {/* Floating car icon */}
              <motion.div 
                className="absolute -right-2 -top-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg"
                initial={{ scale: 0, x: 20, y: -20 }}
                animate={{ 
                  scale: 1, 
                  x: 0, 
                  y: 0,
                  transition: {
                    type: "spring" as const,
                    stiffness: 400,
                    damping: 12,
                    delay: 0.5
                  }
                }}
              >
                <Car className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring" as const,
                  stiffness: 100,
                  damping: 12,
                  delay: 0.4
                }
              }}
            >
              <span className="text-2xl">🛡️</span> Negócios Seguros e Transparentes
            </motion.h2>

            {/* Message */}
            <motion.p 
              className="text-muted-foreground leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring" as const,
                  stiffness: 100,
                  damping: 12,
                  delay: 0.5
                }
              }}
            >
              O acesso ao nosso <span className="font-semibold text-foreground">estoque completo de veículos verificados</span> é 
              exclusivo para membros cadastrados. Protegemos os dados de nossos anunciantes e garantimos a 
              <span className="text-accent font-semibold"> melhor experiência para você</span>. 
              <br />
              <span className="font-medium">Cadastre-se em 1 minuto!</span>
            </motion.p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <motion.div 
                className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    type: "spring" as const,
                    stiffness: 200,
                    damping: 15,
                    delay: 0.6
                  }
                }}
              >
                <Shield className="w-4 h-4" />
                Veículos Verificados
              </motion.div>
              <motion.div 
                className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    type: "spring" as const,
                    stiffness: 200,
                    damping: 15,
                    delay: 0.7
                  }
                }}
              >
                <Lock className="w-4 h-4" />
                Dados Protegidos
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring" as const,
                  stiffness: 150,
                  damping: 15,
                  delay: 0.8
                }
              }}
              whileHover={{ scale: 1.03, transition: { type: "spring" as const, stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                onClick={handleAction}
                className="w-full h-14 text-lg font-bold bg-[#FF8C36] hover:bg-[#e67d2e] text-white rounded-xl shadow-lg shadow-orange-500/30"
              >
                Quero Ver os Veículos
              </Button>
            </motion.div>

            {/* Footer note */}
            <motion.p 
              className="mt-4 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Cadastro rápido • Sem compromisso • Acesso imediato
            </motion.p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RestrictedAccessModal;
