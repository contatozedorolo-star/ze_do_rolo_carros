import { Bot } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const FloatingAssistantButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide button on the assistant page
  if (location.pathname === "/assistente-ia") {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/assistente-ia")}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#142562] hover:bg-[#1a3080] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
      aria-label="Consultor Zé IA"
    >
      <Bot className="w-8 h-8" />
      
      {/* Online indicator */}
      <span className="absolute top-1 right-1 w-4 h-4 bg-[#29B765] rounded-full border-2 border-white animate-pulse" />
      
      {/* Tooltip */}
      <span className="absolute right-20 bg-[#142562] text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        Consultor Zé IA
      </span>
    </button>
  );
};

export default FloatingAssistantButton;
