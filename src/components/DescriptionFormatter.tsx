import { ArrowLeftRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DescriptionFormatterProps {
  description: string;
}

export const DescriptionFormatter = ({ description }: DescriptionFormatterProps) => {
  if (!description) return null;

  // Split description to separate "Trade" section if it exists
  const tradeKeywords = [
    "aceito troca",
    "pego troca",
    "estudo troca",
    "troco por",
    "na troca",
    "aceita troca",
  ];

  let mainDescription = description;
  let tradeDescription = "";

  const lowerDesc = description.toLowerCase();
  let tradeIndex = -1;

  for (const keyword of tradeKeywords) {
    const idx = lowerDesc.indexOf(keyword);
    if (idx !== -1) {
      if (tradeIndex === -1 || idx < tradeIndex) {
        tradeIndex = idx;
      }
    }
  }

  if (tradeIndex !== -1) {
    mainDescription = description.substring(0, tradeIndex).trim();
    tradeDescription = description.substring(tradeIndex).trim();
  }

  const renderContent = (text: string) => {
    // Split by newlines to handle bullet points, but otherwise respect whitespace
    return text.split("\n").map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={index} className="block content-[''] h-2" />;

      const isBullet = /^[-*•]/.test(trimmed);

      if (isBullet) {
        return (
          <div key={index} className="flex items-start gap-2 mb-2 ml-1">
            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FF8C36] shrink-0" />
            <p className="text-slate-600 leading-relaxed">
              {trimmed.replace(/^[-*•]\s*/, "")}
            </p>
          </div>
        );
      }

      // Default paragraph with whitespace-pre-line to respect inner formatting
      return (
        <p key={index} className="text-slate-600 leading-relaxed mb-4 whitespace-pre-line">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Description */}
      <div className="text-sm md:text-base">
        {renderContent(mainDescription)}
      </div>

      {/* Trade Section - Using Alert style for distinction */}
      {tradeDescription && (
        <Alert className="bg-orange-50 border-orange-200">
          <ArrowLeftRight className="h-4 w-4 text-[#FF8C36]" />
          <AlertTitle className="text-[#FF8C36] font-bold mb-2">Sobre Trocas</AlertTitle>
          <AlertDescription className="text-slate-700 text-sm md:text-base italic leading-relaxed">
            {renderContent(tradeDescription)}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
