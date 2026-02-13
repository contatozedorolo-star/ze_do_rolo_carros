
import { Button } from "@/components/ui/button";
import { formatCurrencyShort } from "@/lib/formatters";
import { ArrowLeftRight, MessageCircle } from "lucide-react";
import ProposalDialog from "./ProposalDialog";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface MobileActionDockProps {
  vehicle: {
    id: string;
    title: string;
    price: number;
    user_id: string;
    year_manufacture: number;
    year_model: number;
    accepts_trade: boolean;
  };
}

const MobileActionDock = ({ vehicle }: MobileActionDockProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show dock only after scrolling down a bit (optional - or always visible)
  // For now, let's make it always visible but animate in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:hidden print:hidden"
        >
          <div className="bg-[#142562]/90 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-3">
            {/* Price Info (Left) */}
            <div className="flex flex-col pl-2">
              <span className="text-[10px] text-white/60 uppercase tracking-wider font-medium">
                Valor Total
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white">
                  {formatCurrencyShort(vehicle.price)}
                </span>
              </div>
            </div>

            {/* Actions (Right) */}
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white shrink-0"
                asChild
              >
                <a 
                  href={`https://wa.me/5511999999999?text=Olá, vi o anuncio do ${vehicle.title} e gostaria de mais informações.`} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </Button>

              <ProposalDialog
                vehicleId={vehicle.id}
                vehicleTitle={vehicle.title}
                vehiclePrice={vehicle.price}
                sellerId={vehicle.user_id}
                acceptsTrade={vehicle.accepts_trade}
                trigger={
                  <Button className="h-12 px-6 rounded-xl bg-[#FF8C36] hover:bg-[#ff7a14] text-white font-bold shadow-lg shadow-orange-500/20">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Trocar
                  </Button>
                }
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileActionDock;
