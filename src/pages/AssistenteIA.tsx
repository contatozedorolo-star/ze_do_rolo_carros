import { useState, useRef, useEffect, Suspense, lazy } from "react";
import { Send, Shield, Rocket, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";
import logoZe from "@/assets/logo-zedorolo.png";

const Spline = lazy(() => import("@splinetool/react-spline"));

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ze-ia-chat`;

const INITIAL_MESSAGE = "Olá! Sou o assistente do Zé. Estou visualizando todos os carros, motos, caminhões e vans do site agora. O que você quer negociar hoje?";

const AssistenteIA = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_MESSAGE }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Show modal if not logged in instead of redirecting
  const showRestrictedModal = !loading && !user;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 1) {
      setHasStartedConversation(true);
    }
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: userMessages,
        userId: user?.id 
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao conectar com a IA");
    }

    if (!resp.body) throw new Error("Stream não disponível");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && prev.length > 1) {
                return prev.map((m, i) => 
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Restricted Access Modal */}
      {showRestrictedModal && (
        <RestrictedAccessModal type="assistente-ia" redirectPath="/assistente-ia" />
      )}

      {/* Top Banner - Breathing Space */}
      <div className="bg-white py-4 md:py-6 px-4 flex flex-col items-center justify-center shadow-sm border-b border-border">
        <div className="flex items-center gap-2 text-[#142562] mb-2">
          <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#29B765]" />
          <span className="text-sm md:text-base font-semibold">
            🛡️ Central de Inteligência Zé do Rolo — Versão Beta 2.0
          </span>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm text-center max-w-xl">
          Zé IA: O seu consultor inteligente para compras e trocas. Diga o que você tem, eu encontro o que você precisa.
        </p>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex flex-col lg:flex-row bg-[#142562] min-h-[70vh]">
        {/* Left Side - Spline 3D Robot & Info */}
        <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-4 md:p-6 lg:p-12 min-h-[40vh] lg:min-h-0">
          {/* Spline 3D Scene */}
          <div className="absolute inset-0 z-0">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#FF8C36] border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <Spline 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </Suspense>
          </div>

          {/* Headline & Benefits Overlay */}
          <div className={`relative z-10 text-center lg:text-left max-w-lg transition-all duration-500 ${hasStartedConversation ? 'opacity-0 lg:opacity-100' : 'opacity-100'}`}>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Seu Próximo Negócio <span className="text-[#FF8C36]">Começa Aqui.</span>
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-6 hidden md:block">
              O futuro das trocas é inteligente. Deixe a IA trabalhar por você.
            </p>
            
            {!hasStartedConversation && (
              <div className="space-y-3 md:space-y-4 mt-4 md:mt-8">
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
                  <Rocket className="w-5 h-5 md:w-6 md:h-6 text-[#FF8C36] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-semibold text-xs md:text-sm">Match Perfeito</h3>
                    <p className="text-white/70 text-xs md:text-sm">Cruzamos dados de milhares de anúncios para você não perder tempo.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#29B765] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-semibold text-xs md:text-sm">Segurança Total</h3>
                    <p className="text-white/70 text-xs md:text-sm">Consultoria baseada em vistorias reais e vendedores verificados.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#FF8C36] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-semibold text-xs md:text-sm">Rapidez</h3>
                    <p className="text-white/70 text-xs md:text-sm">Respostas instantâneas sobre preços FIPE e condições de troca.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Interface */}
        <div className="w-full lg:w-1/2 flex flex-col h-[60vh] lg:h-auto relative z-10">
          {/* Chat Container - Glassmorphism */}
          <div className="flex-1 flex flex-col m-4 lg:m-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-white/10 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-lg">
                <img src={logoZe} alt="Consultor Zé" className="w-10 h-10 object-contain" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-white font-semibold text-lg">Consultor Zé IA</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#29B765] rounded-full animate-pulse" />
                  <span className="text-white/70 text-sm">Online - IA de Negócios</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 lg:p-6" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl transition-all duration-300 ${
                        message.role === "user"
                          ? "bg-[#FF8C36] text-white rounded-br-md shadow-lg shadow-orange-500/20"
                          : "bg-[#1a3080] text-white rounded-bl-md border border-white/20 shadow-lg"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
                          <img src={logoZe} alt="Zé" className="w-5 h-5 rounded-full" />
                          <span className="text-sm font-medium text-white/90">Consultor Zé</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="bg-[#1a3080] p-4 rounded-2xl rounded-bl-md border border-white/20">
                      <div className="flex items-center gap-3">
                        <img src={logoZe} alt="Zé" className="w-5 h-5 rounded-full" />
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 bg-[#FF8C36] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-[#FF8C36] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-[#FF8C36] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 lg:p-6 border-t border-white/10">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  disabled={isLoading}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full px-5 py-6 focus-visible:ring-[#FF8C36] focus-visible:ring-2"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-[#FF8C36] hover:bg-[#e67d2e] text-white rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-center text-white/40 text-xs mt-3">
                Powered by Zé do Rolo IA • Acesso total ao banco de veículos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AssistenteIA;
