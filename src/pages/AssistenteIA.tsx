import { useState, useRef, useEffect } from "react";
import { Send, Bot, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import logoZe from "@/assets/logo-zedorolo.png";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ze-ia-chat`;

const AssistenteIA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Eu sou o Consultor Zé IA. Tenho acesso a todo o banco de dados de veículos e propostas do site. Como posso te ajudar a encontrar o negócio perfeito hoje?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
    <div className="min-h-screen bg-[#142562] flex flex-col">
      {/* Security Badge */}
      <div className="bg-[#29B765] text-white py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium">
        <Shield className="w-4 h-4" />
        🛡️ 100% Seguro e Verificado
      </div>

      {/* Header */}
      <div className="bg-[#1a3080] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img src={logoZe} alt="Consultor Zé" className="w-10 h-10 object-contain" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-white font-semibold text-lg">Consultor Zé IA</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#29B765] rounded-full animate-pulse" />
              <span className="text-white/70 text-sm">Online - IA de Negócios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-4 pb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-[#29B765] text-white rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md shadow-md"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                    <Bot className="w-4 h-4 text-[#142562]" />
                    <span className="text-sm font-medium text-[#142562]">Consultor Zé</span>
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
              <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-md">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#142562] animate-pulse" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#142562] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[#142562] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[#142562] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-[#1a3080] border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full px-5 py-6 focus-visible:ring-[#FF8C36]"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-[#FF8C36] hover:bg-[#e67d2e] text-white rounded-full w-12 h-12 p-0 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-center text-white/40 text-xs mt-3 max-w-4xl mx-auto">
          A IA tem acesso ao banco de veículos para te ajudar a encontrar o negócio perfeito
        </p>
      </div>
    </div>
  );
};

export default AssistenteIA;
