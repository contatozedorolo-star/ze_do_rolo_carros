import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Bot } from "lucide-react";

interface ExitIntentAssistantProps {
  /** Só dispara se houver dados preenchidos. */
  enabled: boolean;
}

/**
 * Detecta intenção de sair (mouse saindo pelo topo da janela) e oferece
 * ajuda do Consultor Zé IA antes que o usuário abandone o formulário.
 * Aparece no máximo 1 vez por sessão.
 */
const ExitIntentAssistant = ({ enabled }: ExitIntentAssistantProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (sessionStorage.getItem("zedorolo:exit-intent-shown") === "1") return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Saindo pelo topo (área da barra de endereço / fechar aba)
      if (e.clientY <= 0 && !e.relatedTarget) {
        sessionStorage.setItem("zedorolo:exit-intent-shown", "1");
        setOpen(true);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <Bot className="h-6 w-6" />
          </div>
          <AlertDialogTitle className="text-center">
            Precisa de ajuda para concluir seu anúncio?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            O Consultor Zé IA pode te ajudar a preencher as informações do veículo,
            sugerir preço e dar dicas para vender mais rápido. Seu rascunho fica salvo
            automaticamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continuar preenchendo</AlertDialogCancel>
          <AlertDialogAction onClick={() => navigate("/assistente-ia")}>
            Falar com o Zé IA
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExitIntentAssistant;
