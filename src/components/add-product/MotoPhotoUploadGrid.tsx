import { Camera, X, Check, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoSlot {
  id: string;
  label: string;
  required: boolean;
  orientation: "vertical" | "horizontal";
}

export const motoPhotoCategories = {
  exterior: {
    title: "Exterior 360°",
    description: "Fotos externas da moto",
    photos: [
      { id: "moto_frente", label: "Frente", required: true, orientation: "vertical" as const },
      { id: "moto_diagonal_dir", label: "Diagonal Direita", required: true, orientation: "horizontal" as const },
      { id: "moto_lateral_dir", label: "Lateral Direita", required: true, orientation: "horizontal" as const },
      { id: "moto_diagonal_tras_dir", label: "Diagonal Tras. Dir.", required: true, orientation: "horizontal" as const },
      { id: "moto_traseira", label: "Traseira", required: true, orientation: "vertical" as const },
      { id: "moto_diagonal_tras_esq", label: "Diagonal Tras. Esq.", required: true, orientation: "horizontal" as const },
      { id: "moto_lateral_esq", label: "Lateral Esquerda", required: true, orientation: "horizontal" as const },
      { id: "moto_diagonal_esq", label: "Diagonal Esquerda", required: true, orientation: "horizontal" as const },
    ],
  },
  detalhes: {
    title: "Detalhes",
    description: "Partes importantes da moto",
    photos: [
      { id: "moto_tanque", label: "Tanque", required: true, orientation: "horizontal" as const },
      { id: "moto_painel", label: "Painel/Velocímetro", required: true, orientation: "horizontal" as const },
      { id: "moto_banco", label: "Banco", required: true, orientation: "horizontal" as const },
      { id: "moto_escapamento", label: "Escapamento", required: true, orientation: "horizontal" as const },
      { id: "moto_balanca", label: "Balança", required: false, orientation: "horizontal" as const },
      { id: "moto_guidao", label: "Guidão", required: false, orientation: "horizontal" as const },
    ],
  },
  mecanica: {
    title: "Mecânica",
    description: "Motor, pneus e suspensão",
    photos: [
      { id: "moto_motor", label: "Motor", required: true, orientation: "horizontal" as const },
      { id: "moto_pneu_dianteiro", label: "Pneu Dianteiro", required: true, orientation: "vertical" as const },
      { id: "moto_pneu_traseiro", label: "Pneu Traseiro", required: true, orientation: "vertical" as const },
      { id: "moto_freio_dianteiro", label: "Freio Dianteiro", required: false, orientation: "horizontal" as const },
      { id: "moto_freio_traseiro", label: "Freio Traseiro", required: false, orientation: "horizontal" as const },
      { id: "moto_suspensao_dianteira", label: "Suspensão Dianteira", required: false, orientation: "vertical" as const },
    ],
  },
  documentacao: {
    title: "Documentação",
    description: "Documentos e identificação",
    photos: [
      { id: "moto_placa", label: "Placa", required: true, orientation: "horizontal" as const },
      { id: "moto_chassis", label: "Chassis (Gravação)", required: true, orientation: "horizontal" as const },
      { id: "moto_documento", label: "Documento (CRV)", required: false, orientation: "vertical" as const },
    ],
  },
};

interface MotoPhotoUploadGridProps {
  images: { [key: string]: File | null };
  previews: { [key: string]: string };
  onUpload: (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (photoId: string) => void;
}

const MotoPhotoUploadGrid = ({ images, previews, onUpload, onRemove }: MotoPhotoUploadGridProps) => {
  const getPhotoStatus = (photoId: string) => {
    return previews[photoId] ? "uploaded" : "empty";
  };

  return (
    <div className="space-y-8">
      {Object.entries(motoPhotoCategories).map(([catKey, category]) => (
        <div key={catKey} className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {category.photos.map((photo) => {
              const status = getPhotoStatus(photo.id);
              const preview = previews[photo.id];
              
              return (
                <div key={photo.id} className="relative group">
                  <label
                    htmlFor={photo.id}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden",
                      photo.orientation === "vertical" ? "aspect-[3/4]" : "aspect-[4/3]",
                      status === "uploaded"
                        ? "border-green-500 bg-green-500/5"
                        : photo.required
                          ? "border-primary/50 hover:border-primary bg-muted/30 hover:bg-muted/50"
                          : "border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50"
                    )}
                  >
                    {preview ? (
                      <>
                        <img
                          src={preview}
                          alt={photo.label}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1 p-2 text-center">
                        <Image className={cn(
                          "h-8 w-8",
                          photo.required ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className="text-xs font-medium text-foreground">{photo.label}</span>
                        {photo.required && (
                          <span className="text-[10px] text-primary">Obrigatória</span>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      id={photo.id}
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => onUpload(photo.id, e)}
                    />
                  </label>
                  
                  {preview && (
                    <button
                      type="button"
                      onClick={() => onRemove(photo.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-sm text-primary font-medium">📸 Dica Zé do Rolo</p>
        <p className="text-sm text-muted-foreground mt-1">
          Fotos bem tiradas vendem mais rápido! Fotografe em local iluminado, 
          com a moto limpa e destacando os detalhes importantes.
        </p>
      </div>
    </div>
  );
};

export default MotoPhotoUploadGrid;
