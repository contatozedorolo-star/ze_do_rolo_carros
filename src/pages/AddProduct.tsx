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
import { Card, CardContent } from "@/components/ui/card";
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

type VehicleType = 'sedan' | 'suv' | 'caminhao' | 'moto' | 'picape' | 'van';
type UrgencyLevel = 'baixa' | 'media' | 'alta' | 'emergencial';

const vehicleTypes: { value: VehicleType; label: string; icon: React.ReactNode }[] = [
  { value: "sedan", label: "Sedan/Hatch", icon: <Car className="h-6 w-6" /> },
  { value: "suv", label: "SUV", icon: <CarFront className="h-6 w-6" /> },
  { value: "picape", label: "Picape", icon: <Truck className="h-6 w-6" /> },
  { value: "caminhao", label: "Caminhão", icon: <Truck className="h-6 w-6" /> },
  { value: "moto", label: "Moto", icon: <Bike className="h-6 w-6" /> },
  { value: "van", label: "Van/Utilitário", icon: <Bus className="h-6 w-6" /> },
];

const urgencyLevels: { value: UrgencyLevel; label: string; color: string }[] = [
  { value: "baixa", label: "Baixa", color: "bg-accent" },
  { value: "media", label: "Média", color: "bg-yellow-500" },
  { value: "alta", label: "Alta", color: "bg-secondary" },
  { value: "emergencial", label: "Emergencial", color: "bg-destructive" },
];

const transmissionTypes = ["Automático", "Manual", "CVT", "Automatizado"];
const fuelTypes = ["Gasolina", "Diesel", "Flex", "Elétrico", "Híbrido", "GNV"];
const colorOptions = ["Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul", "Verde", "Amarelo", "Marrom", "Bege", "Outro"];

const requiredPhotos = [
  { id: "frente", label: "Frente" },
  { id: "traseira", label: "Traseira" },
  { id: "lateral_esq", label: "Lateral Esquerda" },
  { id: "lateral_dir", label: "Lateral Direita" },
  { id: "interior", label: "Interior" },
  { id: "painel", label: "Painel/Hodômetro" },
];

const AddProduct = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<{ [key: string]: File | null }>({
    frente: null,
    traseira: null,
    lateral_esq: null,
    lateral_dir: null,
    interior: null,
    painel: null,
  });
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    vehicle_type: "" as VehicleType | "",
    title: "",
    description: "",
    brand: "",
    model: "",
    year: "",
    plate: "",
    mileage: "",
    color: "",
    transmission: "",
    fuel: "",
    optionals: "",
    price_estimate: "",
    min_price_accepted: "",
    is_for_sale: true,
    accepts_trade: true,
    urgency_level: "baixa" as UrgencyLevel,
    location: "",
    rating_motor: 3,
    rating_exterior: 3,
    rating_tires: 3,
    rating_interior: 3,
    rating_documents: 3,
    declared_defects: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleRequiredImageUpload = (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImages(prev => ({ ...prev, [photoId]: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => ({ ...prev, [photoId]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + additionalImages.length > 4) {
      toast({
        title: "Limite de imagens",
        description: "Máximo de 4 imagens adicionais",
        variant: "destructive",
      });
      return;
    }

    setAdditionalImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Verificar fotos obrigatórias
    const missingPhotos = requiredPhotos.filter(p => !images[p.id]);
    if (missingPhotos.length > 0) {
      toast({
        title: "Fotos obrigatórias",
        description: `Adicione as fotos: ${missingPhotos.map(p => p.label).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Create product with vehicle data
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          user_id: user.id,
          category: "veiculos",
          title: formData.title || `${formData.brand} ${formData.model} ${formData.year}`,
          description: formData.description,
          price_estimate: parseFloat(formData.price_estimate),
          min_price_accepted: formData.min_price_accepted ? parseFloat(formData.min_price_accepted) : null,
          is_for_sale: formData.is_for_sale,
          accepts_trade: formData.accepts_trade,
          urgency_level: formData.urgency_level,
          location: formData.location,
          rating_motor: formData.rating_motor,
          rating_exterior: formData.rating_exterior,
          rating_function: formData.rating_tires,
          rating_interior: formData.rating_interior,
          rating_documents: formData.rating_documents,
          declared_defects: formData.declared_defects,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Upload required images
      let imageIndex = 0;
      for (const photo of requiredPhotos) {
        const file = images[photo.id];
        if (!file) continue;

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${product.id}/${photo.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        await supabase
          .from("product_images")
          .insert({
            product_id: product.id,
            image_url: publicUrl,
            image_type: photo.id === "frente" ? "principal" : photo.id,
            display_order: imageIndex,
          });

        imageIndex++;
      }

      // Upload additional images
      for (let i = 0; i < additionalImages.length; i++) {
        const file = additionalImages[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${product.id}/adicional_${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        await supabase
          .from("product_images")
          .insert({
            product_id: product.id,
            image_url: publicUrl,
            image_type: "adicional",
            display_order: imageIndex + i,
          });
      }

      toast({
        title: "Veículo cadastrado!",
        description: "Seu veículo foi adicionado ao seu lote.",
      });

      navigate(`/product/${product.id}`);
    } catch (error: any) {
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
                  <Label htmlFor="brand">Marca *</Label>
                  <Input
                    id="brand"
                    placeholder="Ex: Toyota, Honda, Volkswagen"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modelo *</Label>
                  <Input
                    id="model"
                    placeholder="Ex: Corolla, Civic, Golf"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="year">Ano *</Label>
                  <Input
                    id="year"
                    placeholder="Ex: 2023/2024"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plate">Placa (para consulta)</Label>
                  <Input
                    id="plate"
                    placeholder="ABC-1234"
                    value={formData.plate}
                    onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
                    maxLength={8}
                  />
                  <p className="text-xs text-muted-foreground">Usado para verificar procedência</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Quilometragem *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="Ex: 45000"
                    value={formData.mileage}
                    onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Select value={formData.color} onValueChange={(v) => setFormData(prev => ({ ...prev, color: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmission">Câmbio</Label>
                  <Select value={formData.transmission} onValueChange={(v) => setFormData(prev => ({ ...prev, transmission: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuel">Combustível</Label>
                  <Select value={formData.fuel} onValueChange={(v) => setFormData(prev => ({ ...prev, fuel: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="optionals">Opcionais</Label>
                <Textarea
                  id="optionals"
                  placeholder="Ex: Ar condicionado, Direção elétrica, Vidros elétricos, Multimídia, Câmera de ré..."
                  rows={3}
                  value={formData.optionals}
                  onChange={(e) => setFormData(prev => ({ ...prev, optionals: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Adicional</Label>
                <Textarea
                  id="description"
                  placeholder="Detalhes adicionais sobre o veículo..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  placeholder="Cidade, Estado"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Diagnóstico Zé do Rolo</h2>
              <p className="text-muted-foreground">Avalie a condição do seu veículo honestamente</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Motor: {formData.rating_motor}/5</Label>
                <Slider
                  value={[formData.rating_motor]}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, rating_motor: v[0] }))}
                  max={5}
                  min={0}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">Funcionamento, ruídos, vazamentos</p>
              </div>

              <div className="space-y-3">
                <Label>Lataria/Pintura: {formData.rating_exterior}/5</Label>
                <Slider
                  value={[formData.rating_exterior]}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, rating_exterior: v[0] }))}
                  max={5}
                  min={0}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">Amassados, arranhões, pintura original</p>
              </div>

              <div className="space-y-3">
                <Label>Pneus: {formData.rating_tires}/5</Label>
                <Slider
                  value={[formData.rating_tires]}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, rating_tires: v[0] }))}
                  max={5}
                  min={0}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">Estado dos pneus e rodas</p>
              </div>

              <div className="space-y-3">
                <Label>Interior: {formData.rating_interior}/5</Label>
                <Slider
                  value={[formData.rating_interior]}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, rating_interior: v[0] }))}
                  max={5}
                  min={0}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">Bancos, painel, forro, tapetes</p>
              </div>

              <div className="space-y-3">
                <Label>Documentação: {formData.rating_documents}/5</Label>
                <Slider
                  value={[formData.rating_documents]}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, rating_documents: v[0] }))}
                  max={5}
                  min={0}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">IPVA em dia, multas, restrições</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defects">Defeitos ou Observações</Label>
                <Textarea
                  id="defects"
                  placeholder="Descreva qualquer defeito, avaria, sinistro ou observação importante..."
                  rows={3}
                  value={formData.declared_defects}
                  onChange={(e) => setFormData(prev => ({ ...prev, declared_defects: e.target.value }))}
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
              <p className="text-muted-foreground">Fotos obrigatórias para aprovação</p>
            </div>

            {/* Required Photos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {requiredPhotos.map((photo) => (
                <div key={photo.id} className="space-y-2">
                  <Label className="text-sm">{photo.label} *</Label>
                  {imagePreviews[photo.id] ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                      <img src={imagePreviews[photo.id]} alt={photo.label} className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          setImages(prev => ({ ...prev, [photo.id]: null }));
                          setImagePreviews(prev => {
                            const newPreviews = { ...prev };
                            delete newPreviews[photo.id];
                            return newPreviews;
                          });
                        }}
                        className="absolute top-2 right-2 p-1 bg-destructive rounded-full text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Adicionar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleRequiredImageUpload(photo.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Photos */}
            <div className="pt-4 border-t border-border">
              <Label className="text-sm mb-3 block">Fotos Adicionais (opcional, máx. 4)</Label>
              <div className="grid grid-cols-4 gap-3">
                {additionalPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={preview} alt={`Adicional ${index}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive rounded-full text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {additionalImages.length < 4 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">+</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Valor e Negociação</h2>
              <p className="text-muted-foreground">Configure como você quer negociar</p>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Valor Pedido (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0,00"
                    value={formData.price_estimate}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_estimate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minPrice">Valor Mínimo Aceito (R$)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Opcional"
                    value={formData.min_price_accepted}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_price_accepted: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">Este valor é privado</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label>Disponível para Venda</Label>
                  <p className="text-sm text-muted-foreground">Aceita propostas de compra</p>
                </div>
                <Switch
                  checked={formData.is_for_sale}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_for_sale: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/5">
                <div>
                  <Label>Aceita Troca (O Lote)</Label>
                  <p className="text-sm text-muted-foreground">Aceita veículo + dinheiro como pagamento</p>
                </div>
                <Switch
                  checked={formData.accepts_trade}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, accepts_trade: checked }))}
                />
              </div>

              <div className="space-y-3">
                <Label>Urgência para Negociar</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {urgencyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setFormData(prev => ({ ...prev, urgency_level: level.value }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.urgency_level === level.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`} />
                        <span className="font-medium text-sm">{level.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.vehicle_type;
      case 2: return !!formData.brand && !!formData.model && !!formData.year && !!formData.mileage && !!formData.location;
      case 3: return true;
      case 4: return Object.values(images).every(img => img !== null);
      case 5: return !!formData.price_estimate;
      default: return false;
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
      
      <main className="flex-1 container py-8 max-w-2xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                  s < step
                    ? "bg-accent text-accent-foreground"
                    : s === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? <Check className="h-5 w-5" /> : s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(prev => prev - 1)}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {step < 5 ? (
            <Button
              variant="cta"
              onClick={() => setStep(prev => prev + 1)}
              disabled={!canProceed()}
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="cta"
              onClick={handleSubmit}
              disabled={submitting || !canProceed()}
            >
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
