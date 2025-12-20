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
import { Check, ChevronRight, ChevronLeft, Camera, Car, Truck, Bike, Bus, CarFront } from "lucide-react";
import { brands, colorOptions, transmissionTypes, fuelTypes, carBodyTypes, motoStyles, truckTypes, vanSubcategories } from "@/components/filters/FilterData";

const vehicleTypes = [
  { value: "carro", label: "Carro", icon: Car },
  { value: "moto", label: "Moto", icon: Bike },
  { value: "caminhao", label: "Caminhão", icon: Truck },
  { value: "van", label: "Van", icon: Bus },
  { value: "camionete", label: "Camionete", icon: CarFront },
];

const steps = [
  { id: 1, title: "Dados do Veículo" },
  { id: 2, title: "Diagnóstico" },
  { id: 3, title: "Negócio Ideal" },
  { id: 4, title: "Fotos" },
];

const requiredPhotos = [
  { id: "frente", label: "Frente" },
  { id: "traseira", label: "Traseira" },
  { id: "lateral_esquerda", label: "Lateral Esquerda" },
  { id: "lateral_direita", label: "Lateral Direita" },
  { id: "interior", label: "Interior" },
  { id: "painel", label: "Painel" },
];

const diagnosticItems = [
  { key: "rating_motor", label: "Motor" },
  { key: "rating_cambio", label: "Câmbio" },
  { key: "rating_freios", label: "Freios" },
  { key: "rating_estetica", label: "Estética" },
  { key: "rating_suspensao", label: "Suspensão" },
  { key: "rating_pneus", label: "Pneus" },
  { key: "rating_documentacao", label: "Documentação" },
  { key: "rating_mecanica_geral", label: "Mecânica Geral" },
  { key: "rating_eletrica", label: "Elétrica" },
];

const AddProduct = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<Record<string, any>>({
    vehicle_type: "carro",
    brand: "", model: "", version: "", year_manufacture: "", year_model: "",
    plate: "", km: "", color: "", transmission: "manual", fuel: "flex",
    doors: "", engine: "", price: "", city: "", state: "",
    accepts_trade: true, trade_description: "", description: "",
    // Diagnósticos (0-10)
    rating_motor: 5, rating_cambio: 5, rating_freios: 5, rating_estetica: 5,
    rating_suspensao: 5, rating_pneus: 5, rating_documentacao: 5,
    rating_mecanica_geral: 5, rating_eletrica: 5, diagnostic_notes: "",
    // Negócio ideal
    ideal_trade_description: "", trade_value_accepted: "", min_cash_return: "", ownership_time: "",
    // Procedência
    is_auction: false, is_single_owner: false, ipva_paid: false, has_service_history: false,
    // Específicos
    body_type: "", moto_style: "", truck_type: "", van_subcategory: "", cylinders: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const handleImageUpload = (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImages(prev => ({ ...prev, [photoId]: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreviews(prev => ({ ...prev, [photoId]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!user) return;
    const missingPhotos = requiredPhotos.filter(p => !images[p.id]);
    if (missingPhotos.length > 0) {
      toast({ title: "Fotos obrigatórias", description: `Adicione: ${missingPhotos.map(p => p.label).join(", ")}`, variant: "destructive" });
      return;
    }
    if (!formData.brand || !formData.model || !formData.year_manufacture || !formData.price) {
      toast({ title: "Campos obrigatórios", description: "Preencha marca, modelo, ano e preço", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const vehicleData = {
        user_id: user.id,
        vehicle_type: formData.vehicle_type,
        title: `${formData.brand} ${formData.model} ${formData.year_model || formData.year_manufacture}`,
        brand: formData.brand, model: formData.model, version: formData.version || null,
        year_manufacture: parseInt(formData.year_manufacture),
        year_model: parseInt(formData.year_model || formData.year_manufacture),
        plate: formData.plate || null, plate_end: formData.plate?.slice(-1) || null,
        km: parseInt(formData.km) || 0, color: formData.color,
        transmission: formData.transmission, fuel: formData.fuel,
        doors: formData.doors ? parseInt(formData.doors) : null,
        price: parseFloat(formData.price), accepts_trade: formData.accepts_trade,
        city: formData.city || null, state: formData.state || null,
        description: formData.description || null, diagnostic_notes: formData.diagnostic_notes || null,
        // Diagnósticos
        rating_motor: formData.rating_motor, rating_cambio: formData.rating_cambio,
        rating_freios: formData.rating_freios, rating_estetica: formData.rating_estetica,
        rating_suspensao: formData.rating_suspensao, rating_pneus: formData.rating_pneus,
        rating_documentacao: formData.rating_documentacao, rating_mecanica_geral: formData.rating_mecanica_geral,
        rating_eletrica: formData.rating_eletrica,
        // Negócio
        ideal_trade_description: formData.ideal_trade_description || null,
        trade_value_accepted: formData.trade_value_accepted ? parseFloat(formData.trade_value_accepted) : null,
        min_cash_return: formData.min_cash_return ? parseFloat(formData.min_cash_return) : null,
        ownership_time: formData.ownership_time || null,
        // Procedência
        is_auction: formData.is_auction, is_single_owner: formData.is_single_owner,
        ipva_paid: formData.ipva_paid, has_service_history: formData.has_service_history,
        // Específicos
        body_type: formData.body_type || null, moto_style: formData.moto_style || null,
        truck_type: formData.truck_type || null, van_subcategory: formData.van_subcategory || null,
        cylinders: formData.cylinders ? parseInt(formData.cylinders) : null,
      };

      const { data: vehicle, error: vehicleError } = await supabase.from("vehicles").insert(vehicleData).select().single();
      if (vehicleError) throw vehicleError;

      for (const photo of requiredPhotos) {
        const file = images[photo.id];
        if (!file) continue;
        const fileName = `${user.id}/${vehicle.id}/${photo.id}.${file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from("vehicle-images").upload(fileName, file);
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from("vehicle-images").getPublicUrl(fileName);
          await supabase.from("vehicle_images").insert({ vehicle_id: vehicle.id, image_url: publicUrl, image_type: photo.id, is_primary: photo.id === "frente" });
        }
      }

      toast({ title: "Veículo cadastrado!", description: "Seu veículo foi adicionado com sucesso." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const currentBrands = brands[formData.vehicle_type as keyof typeof brands] || brands.carro;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-4xl">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${step >= s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > s.id ? <Check className="h-5 w-5" /> : s.id}
              </div>
              <span className={`ml-2 hidden sm:block text-sm font-medium ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</span>
              {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step > s.id ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border p-6">
          {/* Step 1 - Dados */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Dados do Veículo</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {vehicleTypes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button key={t.value} onClick={() => setFormData(p => ({ ...p, vehicle_type: t.value, brand: "" }))}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${formData.vehicle_type === t.value ? "border-primary bg-primary/5" : "border-border"}`}>
                      <Icon className={`h-6 w-6 ${formData.vehicle_type === t.value ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium">{t.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label>Marca *</Label><Select value={formData.brand} onValueChange={v => setFormData(p => ({ ...p, brand: v }))}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{currentBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Modelo *</Label><Input value={formData.model} onChange={e => setFormData(p => ({ ...p, model: e.target.value }))} /></div>
                <div><Label>Ano Fabricação *</Label><Input type="number" value={formData.year_manufacture} onChange={e => setFormData(p => ({ ...p, year_manufacture: e.target.value }))} /></div>
                <div><Label>Ano Modelo</Label><Input type="number" value={formData.year_model} onChange={e => setFormData(p => ({ ...p, year_model: e.target.value }))} /></div>
                <div><Label>Quilometragem</Label><Input type="number" value={formData.km} onChange={e => setFormData(p => ({ ...p, km: e.target.value }))} /></div>
                <div><Label>Preço *</Label><Input type="number" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} /></div>
                <div><Label>Cor</Label><Select value={formData.color} onValueChange={v => setFormData(p => ({ ...p, color: v }))}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{colorOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Câmbio</Label><Select value={formData.transmission} onValueChange={v => setFormData(p => ({ ...p, transmission: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{transmissionTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Combustível</Label><Select value={formData.fuel} onValueChange={v => setFormData(p => ({ ...p, fuel: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{fuelTypes.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Cidade</Label><Input value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} /></div>
                <div><Label>Estado</Label><Input maxLength={2} value={formData.state} onChange={e => setFormData(p => ({ ...p, state: e.target.value.toUpperCase() }))} /></div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label>Aceita Troca</Label><p className="text-sm text-muted-foreground">Aceita outro veículo como parte do pagamento</p></div><Switch checked={formData.accepts_trade} onCheckedChange={v => setFormData(p => ({ ...p, accepts_trade: v }))} /></div>
            </div>
          )}

          {/* Step 2 - Diagnóstico */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Diagnóstico do Veículo</h2>
              <p className="text-muted-foreground">Avalie cada item de 0 a 10</p>
              <div className="grid gap-6 md:grid-cols-2">
                {diagnosticItems.map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between"><Label>{label}</Label><span className="font-bold text-primary">{formData[key]}/10</span></div>
                    <Slider value={[formData[key]]} onValueChange={v => setFormData(p => ({ ...p, [key]: v[0] }))} max={10} min={0} step={1} />
                  </div>
                ))}
              </div>
              <div><Label>Observações</Label><Textarea value={formData.diagnostic_notes} onChange={e => setFormData(p => ({ ...p, diagnostic_notes: e.target.value }))} placeholder="Detalhes sobre a condição do veículo..." /></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 border rounded-lg"><Switch checked={formData.is_single_owner} onCheckedChange={v => setFormData(p => ({ ...p, is_single_owner: v }))} /><Label>Único Dono</Label></div>
                <div className="flex items-center gap-3 p-3 border rounded-lg"><Switch checked={formData.ipva_paid} onCheckedChange={v => setFormData(p => ({ ...p, ipva_paid: v }))} /><Label>IPVA Pago</Label></div>
                <div className="flex items-center gap-3 p-3 border rounded-lg"><Switch checked={formData.has_service_history} onCheckedChange={v => setFormData(p => ({ ...p, has_service_history: v }))} /><Label>Revisões em Dia</Label></div>
                <div className="flex items-center gap-3 p-3 border rounded-lg"><Switch checked={formData.is_auction} onCheckedChange={v => setFormData(p => ({ ...p, is_auction: v }))} /><Label>Veículo de Leilão</Label></div>
              </div>
            </div>
          )}

          {/* Step 3 - Negócio Ideal */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">O Negócio Ideal</h2>
              <p className="text-muted-foreground">Descreva como seria o negócio perfeito para você</p>
              <div><Label>Descreva a troca ideal</Label><Textarea value={formData.ideal_trade_description} onChange={e => setFormData(p => ({ ...p, ideal_trade_description: e.target.value }))} placeholder="Ex: Aceito moto até R$ 15.000 e o restante em dinheiro, ou carro popular do mesmo valor..." rows={4} /></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label>Valor máximo de troca aceito (R$)</Label><Input type="number" value={formData.trade_value_accepted} onChange={e => setFormData(p => ({ ...p, trade_value_accepted: e.target.value }))} placeholder="15000" /></div>
                <div><Label>Volta mínima em dinheiro (R$)</Label><Input type="number" value={formData.min_cash_return} onChange={e => setFormData(p => ({ ...p, min_cash_return: e.target.value }))} placeholder="5000" /></div>
              </div>
              <div><Label>Há quanto tempo você possui o veículo?</Label><Select value={formData.ownership_time} onValueChange={v => setFormData(p => ({ ...p, ownership_time: v }))}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="menos_1_ano">Menos de 1 ano</SelectItem><SelectItem value="1_3_anos">1 a 3 anos</SelectItem><SelectItem value="3_5_anos">3 a 5 anos</SelectItem><SelectItem value="mais_5_anos">Mais de 5 anos</SelectItem></SelectContent></Select></div>
            </div>
          )}

          {/* Step 4 - Fotos */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Fotos do Veículo</h2>
              <p className="text-muted-foreground">Adicione fotos de todos os ângulos</p>
              <div className="grid gap-4 md:grid-cols-3">
                {requiredPhotos.map((photo) => (
                  <div key={photo.id}>
                    <Label>{photo.label} *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg aspect-video relative hover:border-primary/50 cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" id={`photo-${photo.id}`} onChange={e => handleImageUpload(photo.id, e)} />
                      <label htmlFor={`photo-${photo.id}`} className="absolute inset-0 flex items-center justify-center cursor-pointer">
                        {imagePreviews[photo.id] ? <img src={imagePreviews[photo.id]} alt={photo.label} className="w-full h-full object-cover rounded-lg" /> : <Camera className="h-8 w-8 text-muted-foreground" />}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1}><ChevronLeft className="h-4 w-4 mr-2" />Voltar</Button>
            {step < 4 ? <Button onClick={() => setStep(s => s + 1)}>Próximo<ChevronRight className="h-4 w-4 ml-2" /></Button> : <Button variant="cta" onClick={handleSubmit} disabled={submitting}>{submitting ? "Cadastrando..." : "Cadastrar Veículo"}</Button>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddProduct;
