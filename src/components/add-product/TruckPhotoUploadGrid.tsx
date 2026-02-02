import React from 'react';
import { Camera, X, AlertCircle, ArrowUpFromLine, ArrowDownFromLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoSlot {
  id: string;
  label: string;
  orientation: 'vertical' | 'horizontal';
  required: boolean;
}

interface PhotoCategory {
  title: string;
  photos: PhotoSlot[];
}

export const truckPhotoCategories: Record<string, PhotoCategory> = {
  exterior: {
    title: "Exterior (360°)",
    photos: [
      { id: "frente", label: "Frente", orientation: "vertical", required: true },
      { id: "frontal_esq", label: "Diagonal Frontal Esquerda", orientation: "horizontal", required: true },
      { id: "frontal_dir", label: "Diagonal Frontal Direita", orientation: "horizontal", required: true },
      { id: "lateral_esq", label: "Lateral Esquerda", orientation: "horizontal", required: true },
      { id: "lateral_dir", label: "Lateral Direita", orientation: "horizontal", required: true },
      { id: "traseira", label: "Traseira", orientation: "vertical", required: true },
      { id: "traseira_esq", label: "Diagonal Traseira Esquerda", orientation: "horizontal", required: false },
      { id: "traseira_dir", label: "Diagonal Traseira Direita", orientation: "horizontal", required: false },
    ]
  },
  motor_e_mecanica: {
    title: "Motor e Mecânica",
    photos: [
      { id: "motor", label: "Motor (Capô Aberto)", orientation: "horizontal", required: true },
      { id: "motor_detalhe", label: "Detalhe Motor", orientation: "horizontal", required: false },
      { id: "quinta_roda", label: "Quinta Roda", orientation: "horizontal", required: false },
      { id: "tanques", label: "Tanques de Combustível", orientation: "horizontal", required: false },
      { id: "entre_eixos", label: "Área Entre-Eixos", orientation: "horizontal", required: false },
    ]
  },
  rodagem: {
    title: "Rodagem e Chassi",
    photos: [
      { id: "pneu_dianteiro_esq", label: "Pneu Dianteiro Esq.", orientation: "vertical", required: true },
      { id: "pneu_dianteiro_dir", label: "Pneu Dianteiro Dir.", orientation: "vertical", required: false },
      { id: "pneus_traseiros_esq", label: "Pneus Traseiros Esq.", orientation: "horizontal", required: true },
      { id: "pneus_traseiros_dir", label: "Pneus Traseiros Dir.", orientation: "horizontal", required: false },
      { id: "chassi_vidro", label: "Nº Chassi no Vidro", orientation: "horizontal", required: true },
    ]
  },
  cabine: {
    title: "Cabine e Interior",
    photos: [
      { id: "painel", label: "Painel Completo", orientation: "horizontal", required: true },
      { id: "painel_ligado", label: "Painel Ligado", orientation: "horizontal", required: true },
      { id: "volante", label: "Volante", orientation: "vertical", required: false },
      { id: "banco_motorista", label: "Banco Motorista", orientation: "vertical", required: true },
      { id: "banco_passageiro", label: "Banco Passageiro", orientation: "vertical", required: false },
      { id: "leito", label: "Leito/Cama", orientation: "horizontal", required: false },
      { id: "cabine_geral", label: "Visão Geral Cabine", orientation: "horizontal", required: true },
    ]
  },
  documentos: {
    title: "Documentos",
    photos: [
      { id: "documento", label: "CRLV/Documento", orientation: "vertical", required: true },
      { id: "placa", label: "Placa", orientation: "horizontal", required: true },
    ]
  }
};

interface TruckPhotoUploadGridProps {
  images: { [key: string]: File | null };
  previews: { [key: string]: string };
  onUpload: (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (photoId: string) => void;
}

const TruckPhotoUploadGrid: React.FC<TruckPhotoUploadGridProps> = ({
  images,
  previews,
  onUpload,
  onRemove,
}) => {
  const totalPhotos = Object.values(truckPhotoCategories).reduce((acc, cat) => acc + cat.photos.length, 0);
  const uploadedCount = Object.keys(images).filter(key => images[key]).length;
  const requiredPhotos = Object.values(truckPhotoCategories)
    .flatMap(cat => cat.photos)
    .filter(p => p.required);
  const uploadedRequired = requiredPhotos.filter(p => images[p.id]).length;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progresso das Fotos</span>
          <span className="text-sm text-muted-foreground">{uploadedCount}/{totalPhotos} fotos</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all" 
            style={{ width: `${(uploadedCount / totalPhotos) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {uploadedRequired}/{requiredPhotos.length} obrigatórias
          {uploadedRequired === requiredPhotos.length && (
            <span className="text-green-500 ml-2">✓ Todas obrigatórias enviadas!</span>
          )}
        </p>
      </div>

      {/* Info */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-primary">Guia de Fotos 360° para Caminhões</p>
          <p className="text-xs text-muted-foreground mt-1">
            Fotografe com boa iluminação. Para Cavalos Mecânicos, destaque a quinta roda e o leito.
          </p>
        </div>
      </div>

      {/* Photo Categories */}
      {Object.entries(truckPhotoCategories).map(([catKey, category]) => (
        <div key={catKey} className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {category.title}
            <span className="text-xs font-normal text-muted-foreground">
              ({category.photos.filter(p => images[p.id]).length}/{category.photos.length})
            </span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {category.photos.map((photo) => {
              const hasImage = !!previews[photo.id];
              return (
                <div key={photo.id} className="relative">
                  <div 
                    className={`relative rounded-lg border-2 border-dashed overflow-hidden transition-all ${
                      hasImage 
                        ? "border-primary bg-primary/5" 
                        : photo.required 
                          ? "border-orange-300 bg-orange-50/30" 
                          : "border-border hover:border-primary/50"
                    } ${photo.orientation === 'vertical' ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
                  >
                    {hasImage ? (
                      <>
                        <img 
                          src={previews[photo.id]} 
                          alt={photo.label} 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => onRemove(photo.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-2">
                        <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                        {photo.orientation === 'vertical' ? (
                          <ArrowUpFromLine className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <ArrowDownFromLine className="h-3 w-3 text-muted-foreground rotate-90" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onUpload(photo.id, e)}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-center mt-1 truncate">
                    {photo.label}
                    {photo.required && <span className="text-orange-500 ml-1">*</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TruckPhotoUploadGrid;
