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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ChevronRight, 
  ChevronLeft,
  Upload,
  Camera,
  Car,
  Tv,
  Sofa,
  Shirt,
  Dumbbell,
  Package,
  X,
  Check
} from "lucide-react";

type ProductCategory = 'veiculos' | 'eletronicos' | 'moveis' | 'eletrodomesticos' | 'moda' | 'esportes' | 'outros';
type UrgencyLevel = 'baixa' | 'media' | 'alta' | 'emergencial';

const categories: { value: ProductCategory; label: string; icon: React.ReactNode }[] = [
  { value: "veiculos", label: "Veículos", icon: <Car className="h-6 w-6" /> },
  { value: "eletronicos", label: "Eletrônicos", icon: <Tv className="h-6 w-6" /> },
  { value: "moveis", label: "Móveis", icon: <Sofa className="h-6 w-6" /> },
  { value: "eletrodomesticos", label: "Eletrodomésticos", icon: <Package className="h-6 w-6" /> },
  { value: "moda", label: "Moda", icon: <Shirt className="h-6 w-6" /> },
  { value: "esportes", label: "Esportes", icon: <Dumbbell className="h-6 w-6" /> },
  { value: "outros", label: "Outros", icon: <Package className="h-6 w-6" /> },
];

const urgencyLevels: { value: UrgencyLevel; label: string; color: string }[] = [
  { value: "baixa", label: "Baixa", color: "bg-accent" },
  { value: "media", label: "Média", color: "bg-yellow-500" },
  { value: "alta", label: "Alta", color: "bg-secondary" },
  { value: "emergencial", label: "Emergencial", color: "bg-destructive" },
];

const AddProduct = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    category: "" as ProductCategory | "",
    title: "",
    description: "",
    price_estimate: "",
    min_price_accepted: "",
    is_for_sale: true,
    accepts_trade: true,
    urgency_level: "baixa" as UrgencyLevel,
    location: "",
    rating_motor: 3,
    rating_exterior: 3,
    rating_function: 3,
    rating_interior: 3,
    rating_documents: 3,
    declared_defects: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      toast({
        title: "Limite de imagens",
        description: "Máximo de 10 imagens por produto",
        variant: "destructive",
      });
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setSubmitting(true);

    try {
      // Create product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          user_id: user.id,
          category: formData.category as ProductCategory,
          title: formData.title,
          description: formData.description,
          price_estimate: parseFloat(formData.price_estimate),
          min_price_accepted: formData.min_price_accepted ? parseFloat(formData.min_price_accepted) : null,
          is_for_sale: formData.is_for_sale,
          accepts_trade: formData.accepts_trade,
          urgency_level: formData.urgency_level,
          location: formData.location,
          rating_motor: formData.category === "veiculos" ? formData.rating_motor : null,
          rating_exterior: formData.rating_exterior,
          rating_function: formData.rating_function,
          rating_interior: formData.category === "veiculos" ? formData.rating_interior : null,
          rating_documents: formData.category === "veiculos" ? formData.rating_documents : null,
          declared_defects: formData.declared_defects,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${product.id}/${i}.${fileExt}`;

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
            image_type: i === 0 ? "principal" : "adicional",
            display_order: i,
          });
      }

      toast({
        title: "Produto cadastrado!",
        description: "Seu produto foi adicionado ao seu lote.",
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

  const isVehicle = formData.category === "veiculos";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Qual tipo de produto?</h2>
              <p className="text-muted-foreground">Selecione a categoria do seu item</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.category === cat.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={formData.category === cat.value ? "text-primary" : "text-muted-foreground"}>
                      {cat.icon}
                    </div>
                    <span className="font-medium text-foreground">{cat.label}</span>
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
              <h2 className="text-xl font-bold text-foreground mb-2">Informações Básicas</h2>
              <p className="text-muted-foreground">Descreva seu produto</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Anúncio *</Label>
                <Input
                  id="title"
                  placeholder="Ex: iPhone 13 Pro 256GB"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva seu produto com detalhes..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Valor Estimado (R$) *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
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
              <p className="text-muted-foreground">Avalie a condição do seu produto</p>
            </div>

            <div className="space-y-6">
              {isVehicle && (
                <div className="space-y-3">
                  <Label>Motor: {formData.rating_motor}/5</Label>
                  <Slider
                    value={[formData.rating_motor]}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, rating_motor: v[0] }))}
                    max={5}
                    min={0}
                    step={1}
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label>Aparência Exterior: {formData.rating_exterior}/5</Label>
                <Slider
                  value={[formData.rating_exterior]}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, rating_exterior: v[0] }))}
                  max={5}
                  min={0}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <Label>Funcionamento: {formData.rating_function}/5</Label>
                <Slider
                  value={[formData.rating_function]}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, rating_function: v[0] }))}
                  max={5}
                  min={0}
                  step={1}
                />
              </div>

              {isVehicle && (
                <>
                  <div className="space-y-3">
                    <Label>Interior: {formData.rating_interior}/5</Label>
                    <Slider
                      value={[formData.rating_interior]}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, rating_interior: v[0] }))}
                      max={5}
                      min={0}
                      step={1}
                    />
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
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="defects">Defeitos ou Observações</Label>
                <Textarea
                  id="defects"
                  placeholder="Descreva qualquer defeito, avaria ou observação importante..."
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
              <h2 className="text-xl font-bold text-foreground mb-2">Fotos do Produto</h2>
              <p className="text-muted-foreground">Adicione até 10 imagens</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-destructive rounded-full text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {images.length < 10 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Adicionar</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Dicas para boas fotos:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tire fotos com boa iluminação</li>
                <li>• Mostre o produto de diferentes ângulos</li>
                <li>• Fotografe detalhes e possíveis defeitos</li>
                {isVehicle && <li>• Inclua fotos do motor, interior e documentos</li>}
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Preferências de Negociação</h2>
              <p className="text-muted-foreground">Configure como você quer negociar</p>
            </div>

            <div className="space-y-6">
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

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label>Aceita Troca</Label>
                  <p className="text-sm text-muted-foreground">Aceita propostas de troca</p>
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
      case 1: return !!formData.category;
      case 2: return !!formData.title && !!formData.price_estimate;
      case 3: return true;
      case 4: return true;
      case 5: return true;
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
              disabled={submitting}
            >
              {submitting ? "Cadastrando..." : "Cadastrar Produto"}
            </Button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddProduct;
