import { Shield, FileCheck, Clock, XCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoZe from "@/assets/logo-zedorolo.png";
import { KYCStatusType } from "@/hooks/useKYCStatus";

interface KYCRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycStatus: KYCStatusType;
}

const KYCRequiredModal = ({ isOpen, onClose, kycStatus }: KYCRequiredModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToProfile = () => {
    onClose();
    navigate("/profile?tab=identity");
  };

  // Content based on KYC status
  const getContent = () => {
    switch (kycStatus) {
      case "pending":
        return {
          icon: Clock,
          iconBg: "bg-amber-500",
          title: "Complete sua Verificação",
          emoji: "⏳",
          message: (
            <>
              Você iniciou a verificação de identidade mas <span className="font-semibold text-foreground">ainda não finalizou</span>. 
              Complete o envio dos documentos para poder fazer propostas de troca.
            </>
          ),
          buttonText: "Completar Verificação",
          badges: [
            { icon: FileCheck, text: "Envie seus documentos", color: "bg-amber-500/10 text-amber-600" },
          ],
        };
      case "under_review":
        return {
          icon: Clock,
          iconBg: "bg-blue-500",
          title: "Verificação em Análise",
          emoji: "🔍",
          message: (
            <>
              Seus documentos estão sendo <span className="font-semibold text-foreground">analisados pela nossa equipe</span>. 
              Este processo pode levar até 24 horas. Você receberá uma notificação assim que for aprovado!
            </>
          ),
          buttonText: "Ver Status da Verificação",
          badges: [
            { icon: Clock, text: "Aguardando análise", color: "bg-blue-500/10 text-blue-600" },
          ],
        };
      case "rejected":
        return {
          icon: XCircle,
          iconBg: "bg-red-500",
          title: "Verificação Rejeitada",
          emoji: "❌",
          message: (
            <>
              Infelizmente sua verificação foi <span className="font-semibold text-foreground">rejeitada</span>. 
              Isso pode ter ocorrido por documentos ilegíveis ou informações incorretas. 
              Por favor, envie novos documentos para tentar novamente.
            </>
          ),
          buttonText: "Enviar Novos Documentos",
          badges: [
            { icon: XCircle, text: "Documentos rejeitados", color: "bg-red-500/10 text-red-600" },
          ],
        };
      default:
        return {
          icon: Shield,
          iconBg: "bg-[#FF8C36]",
          title: "Verificação Necessária",
          emoji: "🛡️",
          message: (
            <>
              Para fazer propostas de troca no <span className="font-semibold text-foreground">Zé do Rolo</span>, 
              você precisa <span className="text-[#FF8C36] font-semibold">verificar sua identidade</span>. 
              É rápido, seguro e garante negociações confiáveis para todos!
            </>
          ),
          buttonText: "Verificar Minha Identidade",
          badges: [
            { icon: Shield, text: "Segurança garantida", color: "bg-accent/10 text-accent" },
            { icon: UserCheck, text: "Processo rápido", color: "bg-primary/10 text-primary" },
          ],
        };
    }
  };

  const content = getContent();
  const IconComponent = content.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with blur */}
        <motion.div 
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.1 } }}
          onClick={onClose}
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
              type: "spring",
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
                  type: "spring",
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
              {/* Floating icon */}
              <motion.div 
                className={`absolute -right-2 -top-2 w-10 h-10 ${content.iconBg} rounded-full flex items-center justify-center shadow-lg`}
                initial={{ scale: 0, x: 20, y: -20 }}
                animate={{ 
                  scale: 1, 
                  x: 0, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 12,
                    delay: 0.5
                  }
                }}
              >
                <IconComponent className="w-5 h-5 text-white" />
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
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                  delay: 0.4
                }
              }}
            >
              <span className="text-2xl">{content.emoji}</span> {content.title}
            </motion.h2>

            {/* Message */}
            <motion.p 
              className="text-muted-foreground leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                  delay: 0.5
                }
              }}
            >
              {content.message}
            </motion.p>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {content.badges.map((badge, index) => {
                const BadgeIcon = badge.icon;
                return (
                  <motion.div 
                    key={index}
                    className={`flex items-center gap-1.5 ${badge.color} px-3 py-1.5 rounded-full text-sm font-medium`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.6 + index * 0.1
                      }
                    }}
                  >
                    <BadgeIcon className="w-4 h-4" />
                    {badge.text}
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                  delay: 0.8
                }
              }}
              whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                onClick={handleGoToProfile}
                className="w-full h-14 text-lg font-bold bg-[#FF8C36] hover:bg-[#e67d2e] text-white rounded-xl shadow-lg shadow-orange-500/30"
              >
                {content.buttonText}
              </Button>
            </motion.div>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Fechar
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default KYCRequiredModal;
