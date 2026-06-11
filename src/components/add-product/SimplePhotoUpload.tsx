import { Camera, X, Star, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface SimplePhotoUploadProps {
  images: { [key: string]: File | null };
  previews: { [key: string]: string };
  onUpload: (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (photoId: string) => void;
}

const MIN_PHOTOS = 1;
const SUGGESTED_PHOTOS = 8;

const SimplePhotoUpload = ({ images, previews, onUpload, onRemove }: SimplePhotoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Ordered list of uploaded photo ids (first one = capa)
  const photoIds = Object.keys(previews).filter((id) => previews[id]);
  const count = photoIds.length;

  const handleMultiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file, idx) => {
      const id = `photo_${Date.now()}_${idx}`;
      // Reuse the existing single-file upload contract by faking the event
      const fakeEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onUpload(id, fakeEvent);
    });
    // reset input so user can pick the same file again later
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      {/* Avisos */}
      <div className="rounded-lg border-2 border-secondary/40 bg-secondary/5 p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Star className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <strong>A primeira foto é a capa do anúncio.</strong> Escolha um
            ângulo bom, que valorize o veículo, pois é ela que a pessoa vê quando
            entra no site.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            Quanto mais fotos boas e detalhadas, melhor para quem tiver interesse
            no veículo. Fotos ruins e/ou poucas fotos, muitas vezes fazem com que
            a pessoa nem crie um possível interesse, então coloque o máximo de
            fotos possível.{" "}
            <strong>Indicamos pelo menos {SUGGESTED_PHOTOS} fotos.</strong>
          </p>
        </div>
      </div>

      {/* Progresso */}
      <div className="p-4 bg-muted/30 border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Fotos enviadas
          </span>
          <span
            className={cn(
              "text-sm font-bold",
              count >= SUGGESTED_PHOTOS
                ? "text-green-600"
                : count >= MIN_PHOTOS
                ? "text-secondary"
                : "text-orange-500"
            )}
          >
            {count} {count === 1 ? "foto" : "fotos"}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all",
              count >= SUGGESTED_PHOTOS ? "bg-green-500" : "bg-secondary"
            )}
            style={{
              width: `${Math.min((count / SUGGESTED_PHOTOS) * 100, 100)}%`,
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {count === 0
            ? "Adicione pelo menos 1 foto para publicar."
            : count < SUGGESTED_PHOTOS
            ? `Você pode adicionar mais fotos para deixar o anúncio mais completo.`
            : "Ótimo! Seu anúncio está bem ilustrado."}
        </p>
      </div>

      {/* Grid de fotos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photoIds.map((id, index) => (
          <div key={id} className="relative">
            <div
              className={cn(
                "block aspect-video rounded-lg border-2 overflow-hidden relative",
                index === 0 ? "border-secondary" : "border-border"
              )}
            >
              <img
                src={previews[id]}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> CAPA
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemove(id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                aria-label="Remover foto"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        {/* Botão adicionar */}
        <label
          htmlFor="simple-photo-input"
          className="block aspect-video rounded-lg border-2 border-dashed border-border hover:border-secondary/60 cursor-pointer transition-all bg-muted/20"
        >
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <Camera className="h-6 w-6 mb-1" />
            <span className="text-xs text-center px-2 font-medium">
              {count === 0 ? "Adicionar fotos" : "Adicionar mais"}
            </span>
          </div>
          <input
            ref={inputRef}
            id="simple-photo-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleMultiUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default SimplePhotoUpload;
