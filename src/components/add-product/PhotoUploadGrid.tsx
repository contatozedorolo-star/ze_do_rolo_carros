import { Camera, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const photoCategories = {
  exterior: {
    title: "Fotos Externas (360°)",
    description: "Fotografe o veículo de todos os ângulos",
    photos: [
      { id: "frente", label: "Frente", required: true },
      { id: "diagonal_frente_esq", label: "Diagonal Frontal Esq.", required: true },
      { id: "diagonal_frente_dir", label: "Diagonal Frontal Dir.", required: true },
      { id: "lateral_esquerda", label: "Lateral Esquerda", required: true },
      { id: "lateral_direita", label: "Lateral Direita", required: true },
      { id: "diagonal_tras_esq", label: "Diagonal Traseira Esq.", required: true },
      { id: "diagonal_tras_dir", label: "Diagonal Traseira Dir.", required: true },
      { id: "traseira", label: "Traseira", required: true },
    ],
  },
  interior: {
    title: "Fotos Internas",
    description: "Mostre os detalhes internos do veículo",
    photos: [
      { id: "painel", label: "Painel", required: true },
      { id: "painel_instrumentos", label: "Instrumentos", required: false },
      { id: "banco_motorista", label: "Banco Motorista", required: true },
      { id: "banco_passageiro", label: "Banco Passageiro", required: false },
      { id: "banco_traseiro", label: "Banco Traseiro", required: true },
      { id: "console_central", label: "Console Central", required: false },
      { id: "volante", label: "Volante", required: false },
      { id: "porta_malas", label: "Porta-Malas", required: true },
    ],
  },
  detalhes: {
    title: "Detalhes Importantes",
    description: "Detalhes que comprovam a procedência",
    photos: [
      { id: "motor", label: "Motor", required: true },
      { id: "chassis_vidro", label: "Chassis no Vidro", required: true },
      { id: "pneu_dianteiro_esq", label: "Pneu Diant. Esq.", required: false },
      { id: "pneu_dianteiro_dir", label: "Pneu Diant. Dir.", required: false },
      { id: "pneu_traseiro_esq", label: "Pneu Tras. Esq.", required: false },
      { id: "pneu_traseiro_dir", label: "Pneu Tras. Dir.", required: false },
      { id: "documento", label: "Documento (CRV)", required: false },
      { id: "chave", label: "Chave", required: false },
    ],
  },
  extras: {
    title: "Fotos Extras",
    description: "Adicione fotos adicionais que achar relevante",
    photos: [
      { id: "extra_1", label: "Extra 1", required: false },
      { id: "extra_2", label: "Extra 2", required: false },
      { id: "extra_3", label: "Extra 3", required: false },
      { id: "extra_4", label: "Extra 4", required: false },
      { id: "extra_5", label: "Extra 5", required: false },
      { id: "extra_6", label: "Extra 6", required: false },
    ],
  },
};

interface PhotoUploadGridProps {
  images: { [key: string]: File | null };
  previews: { [key: string]: string };
  onUpload: (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (photoId: string) => void;
}

const PhotoUploadGrid = ({ images, previews, onUpload, onRemove }: PhotoUploadGridProps) => {
  const requiredPhotos = Object.values(photoCategories)
    .flatMap((cat) => cat.photos)
    .filter((p) => p.required);

  const uploadedRequired = requiredPhotos.filter((p) => images[p.id]).length;
  const totalRequired = requiredPhotos.length;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Progresso das fotos obrigatórias</span>
          <span className="text-sm">
            <span className="font-bold text-primary">{uploadedRequired}</span>
            <span className="text-muted-foreground">/{totalRequired}</span>
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary transition-all duration-300"
            style={{ width: `${(uploadedRequired / totalRequired) * 100}%` }}
          />
        </div>
        {uploadedRequired < totalRequired && (
          <p className="text-xs text-muted-foreground mt-2">
            Adicione pelo menos {totalRequired - uploadedRequired} foto(s) obrigatória(s) para publicar
          </p>
        )}
      </div>

      {/* Photo Categories */}
      {Object.entries(photoCategories).map(([key, category]) => (
        <div key={key} className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground">{category.title}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {category.photos.map((photo) => (
              <div key={photo.id} className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`photo-${photo.id}`}
                  onChange={(e) => onUpload(photo.id, e)}
                />
                <label
                  htmlFor={`photo-${photo.id}`}
                  className={cn(
                    "block aspect-video rounded-lg border-2 border-dashed cursor-pointer transition-all hover:border-primary/50 overflow-hidden relative",
                    previews[photo.id] ? "border-solid border-primary" : "border-border",
                    photo.required && !previews[photo.id] && "border-secondary/50 bg-secondary/5"
                  )}
                >
                  {previews[photo.id] ? (
                    <>
                      <img
                        src={previews[photo.id]}
                        alt={photo.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <Camera className="h-6 w-6 mb-1" />
                      <span className="text-xs text-center px-1">{photo.label}</span>
                      {photo.required && (
                        <span className="text-[10px] text-secondary font-medium mt-1">
                          Obrigatória
                        </span>
                      )}
                    </div>
                  )}
                </label>
                {previews[photo.id] && (
                  <button
                    type="button"
                    onClick={() => onRemove(photo.id)}
                    className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoUploadGrid;
export { photoCategories };
