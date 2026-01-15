import { Label } from "@/components/ui/label";
import { Camera, X, CheckCircle2, AlertCircle, Video } from "lucide-react";

interface PhotoSlot {
  id: string;
  label: string;
  orientation: "vertical" | "horizontal";
  required: boolean;
}

interface PhotoCategory {
  title: string;
  photos: PhotoSlot[];
}

export const vanPhotoCategories: Record<string, PhotoCategory> = {
  exterior: {
    title: "📸 Exterior (14 fotos)",
    photos: [
      { id: "frente", label: "Frente", orientation: "horizontal", required: true },
      { id: "frente_v", label: "Frente (V)", orientation: "vertical", required: false },
      { id: "diagonal_dianteira_dir", label: "Diagonal Diant. Dir", orientation: "horizontal", required: true },
      { id: "diagonal_dianteira_dir_v", label: "Diagonal Diant. Dir (V)", orientation: "vertical", required: false },
      { id: "lateral_direita", label: "Lateral Direita", orientation: "horizontal", required: true },
      { id: "lateral_direita_v", label: "Lateral Direita (V)", orientation: "vertical", required: false },
      { id: "diagonal_traseira_dir", label: "Diagonal Tras. Dir", orientation: "horizontal", required: true },
      { id: "diagonal_traseira_dir_v", label: "Diagonal Tras. Dir (V)", orientation: "vertical", required: false },
      { id: "traseira", label: "Traseira", orientation: "horizontal", required: true },
      { id: "traseira_v", label: "Traseira (V)", orientation: "vertical", required: false },
      { id: "diagonal_traseira_esq", label: "Diagonal Tras. Esq", orientation: "horizontal", required: true },
      { id: "diagonal_traseira_esq_v", label: "Diagonal Tras. Esq (V)", orientation: "vertical", required: false },
      { id: "lateral_esquerda", label: "Lateral Esquerda", orientation: "horizontal", required: true },
      { id: "lateral_esquerda_v", label: "Lateral Esquerda (V)", orientation: "vertical", required: false },
    ],
  },
  interior_motorista: {
    title: "🚗 Interior - Cabine (10 fotos)",
    photos: [
      { id: "painel", label: "Painel Geral", orientation: "horizontal", required: true },
      { id: "painel_v", label: "Painel (V)", orientation: "vertical", required: false },
      { id: "volante", label: "Volante", orientation: "horizontal", required: true },
      { id: "console", label: "Console Central", orientation: "horizontal", required: false },
      { id: "banco_motorista", label: "Banco Motorista", orientation: "vertical", required: true },
      { id: "banco_passageiro", label: "Banco Passageiro", orientation: "vertical", required: false },
      { id: "cambio", label: "Câmbio", orientation: "vertical", required: false },
      { id: "porta_motorista", label: "Porta Motorista", orientation: "vertical", required: false },
      { id: "hodometro", label: "Hodômetro", orientation: "horizontal", required: true },
      { id: "ar_condicionado", label: "Ar Condicionado", orientation: "horizontal", required: false },
    ],
  },
  interior_passageiros: {
    title: "👥 Interior - Área de Carga/Passageiros (10 fotos)",
    photos: [
      { id: "area_carga_geral", label: "Área Carga/Passageiros", orientation: "horizontal", required: true },
      { id: "area_carga_v", label: "Área Carga (V)", orientation: "vertical", required: false },
      { id: "bancos_traseiros_1", label: "Bancos Traseiros 1", orientation: "horizontal", required: true },
      { id: "bancos_traseiros_2", label: "Bancos Traseiros 2", orientation: "horizontal", required: false },
      { id: "piso_interno", label: "Piso Interno", orientation: "horizontal", required: false },
      { id: "teto_interno", label: "Teto Interno", orientation: "horizontal", required: false },
      { id: "porta_lateral", label: "Porta Lateral", orientation: "vertical", required: true },
      { id: "porta_traseira_int", label: "Porta Traseira (int)", orientation: "horizontal", required: false },
      { id: "divisoria", label: "Divisória (se houver)", orientation: "horizontal", required: false },
      { id: "acabamento_interno", label: "Acabamento Interno", orientation: "vertical", required: false },
    ],
  },
  pneus: {
    title: "🔧 Pneus e Rodas (8 fotos)",
    photos: [
      { id: "pneu_dianteiro_dir", label: "Pneu Diant. Dir", orientation: "vertical", required: true },
      { id: "pneu_dianteiro_esq", label: "Pneu Diant. Esq", orientation: "vertical", required: true },
      { id: "pneu_traseiro_dir", label: "Pneu Tras. Dir", orientation: "vertical", required: true },
      { id: "pneu_traseiro_esq", label: "Pneu Tras. Esq", orientation: "vertical", required: true },
      { id: "roda_dianteira", label: "Roda Dianteira", orientation: "vertical", required: false },
      { id: "roda_traseira", label: "Roda Traseira", orientation: "vertical", required: false },
      { id: "estepe", label: "Estepe", orientation: "vertical", required: false },
      { id: "sulcos_pneu", label: "Sulcos/Desgaste", orientation: "horizontal", required: false },
    ],
  },
  motor: {
    title: "⚙️ Motor e Mecânica (5 fotos)",
    photos: [
      { id: "motor_geral", label: "Motor (visão geral)", orientation: "horizontal", required: true },
      { id: "motor_v", label: "Motor (V)", orientation: "vertical", required: false },
      { id: "vao_motor", label: "Vão do Motor", orientation: "horizontal", required: false },
      { id: "filtro_ar", label: "Filtro de Ar", orientation: "horizontal", required: false },
      { id: "nivel_oleo", label: "Nível de Óleo", orientation: "horizontal", required: false },
    ],
  },
  documentos: {
    title: "📄 Documentação (2 fotos)",
    photos: [
      { id: "doc_chassis", label: "Chassis no Vidro", orientation: "horizontal", required: true },
      { id: "placa", label: "Placa (Censurada)", orientation: "horizontal", required: true },
    ],
  },
};

interface VanPhotoUploadGridProps {
  images: { [key: string]: File | null };
  previews: { [key: string]: string };
  onUpload: (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (photoId: string) => void;
}

const VanPhotoUploadGrid = ({ images, previews, onUpload, onRemove }: VanPhotoUploadGridProps) => {
  const totalRequired = Object.values(vanPhotoCategories).flatMap(cat => cat.photos).filter(p => p.required).length;
  const uploadedRequired = Object.values(vanPhotoCategories)
    .flatMap(cat => cat.photos)
    .filter(p => p.required && images[p.id])
    .length;

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progresso das fotos obrigatórias</span>
          <span className={`text-sm font-bold ${uploadedRequired === totalRequired ? "text-green-600" : "text-orange-500"}`}>
            {uploadedRequired}/{totalRequired}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${uploadedRequired === totalRequired ? "bg-green-500" : "bg-orange-500"}`}
            style={{ width: `${(uploadedRequired / totalRequired) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          📸 Guia 360° para Vans: Fotografe todos os ângulos incluindo área interna de carga/passageiros
        </p>
      </div>

      {/* Photo categories */}
      {Object.entries(vanPhotoCategories).map(([catKey, category]) => (
        <div key={catKey} className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-lg">{category.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {category.photos.map((photo) => (
              <div key={photo.id} className="relative">
                <Label 
                  htmlFor={photo.id} 
                  className={`block text-xs font-medium mb-1 truncate ${photo.required ? "text-primary" : "text-muted-foreground"}`}
                >
                  {photo.label}
                  {photo.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <div 
                  className={`relative rounded-lg border-2 border-dashed overflow-hidden cursor-pointer transition-all hover:border-primary/50 ${
                    photo.orientation === "vertical" ? "aspect-[3/4]" : "aspect-[4/3]"
                  } ${
                    previews[photo.id] 
                      ? "border-green-500 bg-green-50" 
                      : photo.required 
                        ? "border-orange-300 bg-orange-50/30" 
                        : "border-border bg-muted/20"
                  }`}
                >
                  {previews[photo.id] ? (
                    <>
                      <img 
                        src={previews[photo.id]} 
                        alt={photo.label}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); onRemove(photo.id); }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <CheckCircle2 className="absolute bottom-1 right-1 h-4 w-4 text-green-600" />
                    </>
                  ) : (
                    <label htmlFor={photo.id} className="flex flex-col items-center justify-center h-full cursor-pointer">
                      {photo.required ? (
                        <AlertCircle className="h-6 w-6 text-orange-400 mb-1" />
                      ) : (
                        <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                      )}
                      <span className="text-[10px] text-muted-foreground text-center px-1">
                        {photo.orientation === "vertical" ? "V" : "H"}
                      </span>
                    </label>
                  )}
                  <input
                    type="file"
                    id={photo.id}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onUpload(photo.id, e)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Video slots */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-lg">🎥 Vídeos (2 opcional)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 bg-muted/20">
            <Video className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Vídeo Externo</span>
            <span className="text-xs text-muted-foreground">(Em breve)</span>
          </div>
          <div className="p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 bg-muted/20">
            <Video className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Vídeo Interno</span>
            <span className="text-xs text-muted-foreground">(Em breve)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VanPhotoUploadGrid;
