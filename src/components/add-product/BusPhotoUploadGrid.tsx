import { Camera, X, ImagePlus } from "lucide-react";
import { Label } from "@/components/ui/label";

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

export const busPhotoCategories: Record<string, PhotoCategory> = {
  exterior: {
    title: "Exterior (Vertical)",
    photos: [
      { id: "frente", label: "Frente", orientation: "vertical", required: true },
      { id: "diagonal_frontal_esq", label: "Diagonal Frontal Esq", orientation: "vertical", required: true },
      { id: "diagonal_frontal_dir", label: "Diagonal Frontal Dir", orientation: "vertical", required: true },
      { id: "lateral_esq", label: "Lateral Esquerda", orientation: "vertical", required: true },
      { id: "lateral_dir", label: "Lateral Direita", orientation: "vertical", required: true },
      { id: "diagonal_tras_esq", label: "Diagonal Traseira Esq", orientation: "vertical", required: true },
      { id: "diagonal_tras_dir", label: "Diagonal Traseira Dir", orientation: "vertical", required: true },
      { id: "traseira", label: "Traseira", orientation: "vertical", required: true },
      { id: "teto", label: "Teto/Vista Superior", orientation: "vertical", required: false },
      { id: "porta_entrada", label: "Porta de Entrada", orientation: "vertical", required: true },
      { id: "porta_saida", label: "Porta de Saída", orientation: "vertical", required: false },
      { id: "bagageiro_aberto", label: "Bagageiro Aberto", orientation: "vertical", required: true },
      { id: "rodas_dianteiras", label: "Rodas Dianteiras", orientation: "vertical", required: false },
      { id: "rodas_traseiras", label: "Rodas Traseiras", orientation: "vertical", required: false },
    ],
  },
  exterior_horizontal: {
    title: "Exterior (Horizontal)",
    photos: [
      { id: "frente_h", label: "Frente (H)", orientation: "horizontal", required: false },
      { id: "lateral_esq_h", label: "Lateral Esquerda (H)", orientation: "horizontal", required: true },
      { id: "lateral_dir_h", label: "Lateral Direita (H)", orientation: "horizontal", required: true },
      { id: "traseira_h", label: "Traseira (H)", orientation: "horizontal", required: false },
      { id: "diagonal_frontal_h", label: "Diagonal Frontal (H)", orientation: "horizontal", required: false },
      { id: "diagonal_tras_h", label: "Diagonal Traseira (H)", orientation: "horizontal", required: false },
    ],
  },
  motor: {
    title: "Motor e Mecânica",
    photos: [
      { id: "motor_aberto", label: "Motor (Capô Aberto)", orientation: "horizontal", required: true },
      { id: "motor_detalhe", label: "Motor Detalhe", orientation: "horizontal", required: false },
      { id: "motor_identificacao", label: "Identificação Motor", orientation: "horizontal", required: false },
      { id: "suspensao", label: "Suspensão", orientation: "horizontal", required: false },
      { id: "escapamento", label: "Escapamento", orientation: "horizontal", required: false },
    ],
  },
  interior: {
    title: "Interior e Passageiros",
    photos: [
      { id: "painel", label: "Painel Completo", orientation: "horizontal", required: true },
      { id: "volante", label: "Volante/Controles", orientation: "horizontal", required: true },
      { id: "banco_motorista", label: "Banco Motorista", orientation: "vertical", required: true },
      { id: "corredor_frente", label: "Corredor (Vista Frontal)", orientation: "vertical", required: true },
      { id: "corredor_tras", label: "Corredor (Vista Traseira)", orientation: "vertical", required: true },
      { id: "bancos_passageiros_1", label: "Bancos Passageiros 1", orientation: "horizontal", required: true },
      { id: "bancos_passageiros_2", label: "Bancos Passageiros 2", orientation: "horizontal", required: false },
      { id: "bancos_passageiros_3", label: "Bancos Passageiros 3", orientation: "horizontal", required: false },
      { id: "teto_interior", label: "Teto Interior", orientation: "horizontal", required: false },
      { id: "ar_condicionado", label: "Sistema de Ar", orientation: "horizontal", required: false },
      { id: "banheiro", label: "Banheiro (se houver)", orientation: "vertical", required: false },
      { id: "poltrona_detalhe", label: "Poltrona Detalhe", orientation: "vertical", required: false },
    ],
  },
  detalhes: {
    title: "Detalhes e Identificação",
    photos: [
      { id: "chassis_vidro", label: "Chassis no Vidro", orientation: "horizontal", required: true },
      { id: "placa", label: "Placa", orientation: "horizontal", required: true },
      { id: "hodometro", label: "Hodômetro", orientation: "horizontal", required: true },
      { id: "escada_entrada", label: "Escada/Soleira", orientation: "vertical", required: false },
      { id: "pneu_dianteiro", label: "Pneu Dianteiro", orientation: "vertical", required: true },
      { id: "pneu_traseiro", label: "Pneu Traseiro", orientation: "vertical", required: true },
      { id: "retrovisores", label: "Retrovisores", orientation: "horizontal", required: false },
      { id: "farol_dianteiro", label: "Farol Dianteiro", orientation: "horizontal", required: false },
      { id: "lanterna_traseira", label: "Lanterna Traseira", orientation: "horizontal", required: false },
    ],
  },
  documentos: {
    title: "Documentação",
    photos: [
      { id: "doc_crlv", label: "CRLV", orientation: "vertical", required: true },
      { id: "doc_renavam", label: "Renavam", orientation: "vertical", required: false },
      { id: "doc_manual", label: "Manual Proprietário", orientation: "horizontal", required: false },
    ],
  },
};

interface BusPhotoUploadGridProps {
  images: { [key: string]: File | null };
  previews: { [key: string]: string };
  onUpload: (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (photoId: string) => void;
}

const BusPhotoUploadGrid = ({ images, previews, onUpload, onRemove }: BusPhotoUploadGridProps) => {
  const totalPhotos = Object.values(busPhotoCategories).reduce(
    (acc, cat) => acc + cat.photos.length, 0
  );
  const uploadedCount = Object.keys(images).filter(k => images[k]).length;
  const requiredPhotos = Object.values(busPhotoCategories)
    .flatMap(cat => cat.photos)
    .filter(p => p.required);
  const requiredUploaded = requiredPhotos.filter(p => images[p.id]).length;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-primary">Galeria 360° Ônibus</p>
              <p className="text-sm text-muted-foreground">
                {uploadedCount} de {totalPhotos} fotos | {requiredUploaded} de {requiredPhotos.length} obrigatórias
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{Math.round((requiredUploaded / requiredPhotos.length) * 100)}%</p>
            <p className="text-xs text-muted-foreground">completo</p>
          </div>
        </div>
      </div>

      {Object.entries(busPhotoCategories).map(([key, category]) => (
        <div key={key} className="space-y-3">
          <Label className="text-base font-semibold">{category.title}</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {category.photos.map((photo) => (
              <div key={photo.id} className="relative">
                <input
                  type="file"
                  id={`photo-${photo.id}`}
                  accept="image/*"
                  onChange={(e) => onUpload(photo.id, e)}
                  className="hidden"
                />
                <label
                  htmlFor={`photo-${photo.id}`}
                  className={`block cursor-pointer rounded-lg border-2 border-dashed transition-all hover:border-primary/50 ${
                    photo.orientation === "vertical" ? "aspect-[3/4]" : "aspect-[4/3]"
                  } ${
                    previews[photo.id]
                      ? "border-primary bg-primary/5"
                      : photo.required
                        ? "border-orange-300 bg-orange-50/30"
                        : "border-border"
                  }`}
                >
                  {previews[photo.id] ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previews[photo.id]}
                        alt={photo.label}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onRemove(photo.id);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-2 text-center">
                      <ImagePlus className={`h-6 w-6 mb-1 ${photo.required ? "text-orange-400" : "text-muted-foreground"}`} />
                      <span className="text-xs text-muted-foreground leading-tight">{photo.label}</span>
                      {photo.required && (
                        <span className="text-[10px] text-orange-500 mt-1">Obrigatória</span>
                      )}
                    </div>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Dica:</strong> Fotografe em local iluminado, com o ônibus limpo. 
          Mostre todos os ângulos do veículo, especialmente o interior com os bancos de passageiros.
          Fotos de qualidade aumentam em 3x as chances de proposta!
        </p>
      </div>
    </div>
  );
};

export default BusPhotoUploadGrid;
