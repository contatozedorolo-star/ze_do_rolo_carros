import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ChevronRight, 
  ChevronLeft,
  Camera,
  Car,
  Truck,
  Bike,
  Bus,
  CarFront,
  X,
  Check
} from "lucide-react";

const vehicleTypes = [
  { value: "carro", label: "Carro", icon: <Car className="h-6 w-6" /> },
  { value: "caminhao", label: "Caminhão", icon: <Truck className="h-6 w-6" /> },
  { value: "moto", label: "Moto", icon: <Bike className="h-6 w-6" /> },
  { value: "camionete", label: "Camionete", icon: <CarFront className="h-6 w-6" /> },
  { value: "van", label: "Van", icon: <Bus className="h-6 w-6" /> },
];

const transmissionTypes = [
  { value: "manual", label: "Manual" },
  { value: "automatico", label: "Automático" },
  { value: "cvt", label: "CVT" },
  { value: "semi-automatico", label: "Semi-Automático" },
];

const fuelTypes = [
  { value: "flex", label: "Flex" },
  { value: "gasolina", label: "Gasolina" },
  { value: "etanol", label: "Etanol" },
  { value: "diesel", label: "Diesel" },
  { value: "eletrico", label: "Elétrico" },
  { value: "hibrido", label: "Híbrido" },
  { value: "gnv", label: "GNV" },
];

const colorOptions = ["Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul", "Verde", "Amarelo", "Marrom", "Bege", "Outro"];

const requiredPhotos = [
  { id: "frente", label: "Frente" },
  { id: "traseira", label: "Traseira" },
  { id: "lateral_esquerda", label: "Lateral Esquerda" },
  { id: "lateral_direita", label: "Lateral Direita" },
  { id: "interior", label: "Interior" },
  { id: "painel", label: "Painel/Hodômetro" },
];

const AddProduct = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    vehicle_type: "carro",
    title: "",
    description: "",
    brand: "",
    model: "",
    version: "",
    year_manufacture: "",
    year_model: "",
    plate: "",
    km: "",
    color: "",
    transmission: "manual",
    fuel: "flex",
    doors: "",
    engine: "",
    optionals: "",
    price: "",
    accepts_trade: true,
    trade_description: "",
    city: "",
    state: "",
    rating_motor: 3,
    rating_lataria: 3,
    rating_pneus: 3,
    rating_interior: 3,
    rating_documentacao: 3,
    diagnostic_notes: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleImageUpload = (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImages(prev => ({ ...prev, [photoId]: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => ({ ...prev, [photoId]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const missingPhotos = requiredPhotos.filter(p => !images[p.id]);
    if (missingPhotos.length > 0) {
      toast({
        title: "Fotos obrigatórias",
        description: `Adicione as fotos: ${missingPhotos.map(p => p.label).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    if (!formData.brand || !formData.model || !formData.year_manufacture || !formData.price) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha marca, modelo, ano e preço",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const vehicleData = {
        user_id: user.id,
        vehicle_type: formData.vehicle_type as "carro" | "caminhao" | "moto" | "camionete" | "van",
        title: formData.title || `${formData.brand} ${formData.model} ${formData.year_model || formData.year_manufacture}`,
        description: formData.description || null,
        brand: formData.brand,
        model: formData.model,
        version: formData.version || null,
        year_manufacture: parseInt(formData.year_manufacture),
        year_model: parseInt(formData.year_model || formData.year_manufacture),
        plate: formData.plate || null,
        plate_end: formData.plate ? formData.plate.slice(-1) : null,
        km: parseInt(formData.km) || 0,
        color: formData.color,
        transmission: formData.transmission as "manual" | "automatico" | "cvt" | "semi-automatico",
        fuel: formData.fuel as "gasolina" | "etanol" | "flex" | "diesel" | "eletrico" | "hibrido" | "gnv",
        doors: formData.doors ? parseInt(formData.doors) : null,
        engine: formData.engine || null,
        price: parseFloat(formData.price),
        accepts_trade: formData.accepts_trade,
        trade_description: formData.trade_description || null,
        city: formData.city || null,
        state: formData.state || null,
        rating_motor: formData.rating_motor,
        rating_lataria: formData.rating_lataria,
        rating_pneus: formData.rating_pneus,
        rating_interior: formData.rating_interior,
        rating_documentacao: formData.rating_documentacao,
        diagnostic_notes: formData.diagnostic_notes || null,
        optionals: formData.optionals ? formData.optionals.split(',').map(o => o.trim()) : null,
      };

      const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .insert(vehicleData)
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // Upload images (note: storage bucket needs to be created)
      for (const photo of requiredPhotos) {
        const file = images[photo.id];
        if (!file) continue;

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${vehicle.id}/${photo.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("vehicle-images")
          .upload(fileName, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("vehicle-images")
            .getPublicUrl(fileName);

          await supabase.from("vehicle_images").insert({
            vehicle_id: vehicle.id,
            image_url: publicUrl,
            image_type: photo.id,
            is_primary: photo.id === "frente",
          });
        }
      }

      toast({
        title: "Veículo cadastrado!",
        description: "Seu veículo foi adicionado com sucesso.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Tipo de Veículo</h2>
              <p className="text-muted-foreground">Selecione o tipo do seu veículo</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vehicleTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFormData(prev => ({ ...prev, vehicle_type: type.value }))}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.vehicle_type === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={formData.vehicle_type === type.value ? "text-primary" : "text-muted-foreground"}>
                      {type.icon}
                    </div>
                    <span className="font-medium text-foreground">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Dados do Veículo</h2>
              <p className="text-muted-foreground">Informe os dados técnicos</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Marca *</Label>
                  <Input
                    placeholder="Ex: Toyota, Honda"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modelo *</Label>
                  <Input
                    placeholder="Ex: Corolla, Civic"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Ano Fabricação *</Label>
                  <Input
                    type="number"
                    placeholder="2023"
                    value={formData.year_manufacture}
                    onChange={(e) => setFormData(prev => ({ ...prev, year_manufacture: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ano Modelo</Label>
                  <Input
                    type="number"
                    placeholder="2024"
                    value={formData.year_model}
                    onChange={(e) => setFormData(prev => ({ ...prev, year_model: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quilometragem</Label>
                  <Input
                    type="number"
                    placeholder="45000"
                    value={formData.km}
                    onChange={(e) => setFormData(prev => ({ ...prev, km: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Cor</Label>
                  <Select value={formData.color} onValueChange={(v) => setFormData(prev => ({ ...prev, color: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Câmbio</Label>
                  <Select value={formData.transmission} onValueChange={(v) => setFormData(prev => ({ ...prev, transmission: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Combustível</Label>
                  <Select value={formData.fuel} onValueChange={(v) => setFormData(prev => ({ ...prev, fuel: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((f) => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    placeholder="São Paulo"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input
                    placeholder="SP"
                    maxLength={2}
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preço *</Label>
                <Input
                  type="number"
                  placeholder="85000"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Aceita Troca</Label>
                  <p className="text-sm text-muted-foreground">Aceita outro veículo como parte do pagamento</p>
                </div>
                <Switch
                  checked={formData.accepts_trade}
                  onCheckedChange={(v) => setFormData(prev => ({ ...prev, accepts_trade: v }))}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Diagnóstico</h2>
              <p className="text-muted-foreground">Avalie a condição do veículo</p>
            </div>

            <div className="space-y-6">
              {[
                { key: "rating_motor", label: "Motor" },
                { key: "rating_lataria", label: "Lataria/Pintura" },
                { key: "rating_pneus", label: "Pneus" },
                { key: "rating_interior", label: "Interior" },
                { key: "rating_documentacao", label: "Documentação" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-3">
                  <Label>{label}: {formData[key as keyof typeof formData]}/5</Label>
                  <Slider
                    value={[formData[key as keyof typeof formData] as number]}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, [key]: v[0] }))}
                    max={5}
                    min={1}
                    step={1}
                  />
                </div>
              ))}

              <div className="space-y-2">
                <Label>Observações do Diagnóstico</Label>
                <Textarea
                  placeholder="Detalhes sobre a condição do veículo..."
                  value={formData.diagnostic_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnostic_notes: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Fotos do Veículo</h2>
              <p className="text-muted-foreground">Adicione fotos obrigatórias</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {requiredPhotos.map((photo) => (
                <div key={photo.id} className="space-y-2">
                  <Label>{photo.label} *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors aspect-video relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`photo-${photo.id}`}
                      onChange={(e) => handleImageUpload(photo.id, e)}
                    />
                    <label htmlFor={`photo-${photo.id}`} className="cursor-pointer absolute inset-0 flex items-center justify-center">
                      {imagePreviews[photo.id] ? (
                        <img src={imagePreviews[photo.id]} alt={photo.label} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{photo.label}</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s === step
                    ? "bg-primary text-primary-foreground"
                    : s < step
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? <Check className="h-4 w-4" /> : s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          {step < 4 ? (
            <Button onClick={() => setStep(s => s + 1)}>
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button variant="cta" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Cadastrando..." : "Cadastrar Veículo"}
            </Button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddProduct;
