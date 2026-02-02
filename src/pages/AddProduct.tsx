import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useKYCStatus } from "@/hooks/useKYCStatus";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, ChevronLeft, Car, Truck, Bike, Bus, CarFront, DollarSign, ExternalLink, ShieldCheck, AlertTriangle, Settings2 } from "lucide-react";
import { 
  brands, colorOptions, transmissionTypes, fuelTypes, 
  engineLiters, doorOptions, seatOptions, auctionReasons,
  insuranceOptions, tradePriorityOptions,
  motoStartTypes, motoMotorTypes, motoBrakeTypes, motoOptionals, cylinderRanges, motoFuelSystems,
  truckTractions, truckBodies, truckCabins, truckOptionals, truckSeatOptions,
  vanOptionals, vanTractions, steeringTypes, windowTypes, vanEngineLiters,
  busOptionals, busTractions, busSeatRanges
} from "@/components/filters/FilterData";
import StepIndicator from "@/components/add-product/StepIndicator";
import CarBodyTypeSelector from "@/components/add-product/CarBodyTypeSelector";
import DiagnosticSlider from "@/components/add-product/DiagnosticSlider";
import PhotoUploadGrid, { photoCategories } from "@/components/add-product/PhotoUploadGrid";
import TradeRestrictionsInput from "@/components/add-product/TradeRestrictionsInput";
import MotoStyleSelector from "@/components/add-product/MotoStyleSelector";
import MotoPhotoUploadGrid, { motoPhotoCategories } from "@/components/add-product/MotoPhotoUploadGrid";
import TruckTypeSelector from "@/components/add-product/TruckTypeSelector";
import TruckPhotoUploadGrid, { truckPhotoCategories } from "@/components/add-product/TruckPhotoUploadGrid";
import VanTypeSelector from "@/components/add-product/VanTypeSelector";
import VanPhotoUploadGrid, { vanPhotoCategories } from "@/components/add-product/VanPhotoUploadGrid";
import BusTypeSelector from "@/components/add-product/BusTypeSelector";
import BusPhotoUploadGrid, { busPhotoCategories } from "@/components/add-product/BusPhotoUploadGrid";
import { formatPriceInput, parsePriceInput } from "@/lib/formatters";
import KYCRequiredModal from "@/components/KYCRequiredModal";

const vehicleTypes = [
  { value: "carro", label: "Carro", icon: Car },
  { value: "moto", label: "Moto", icon: Bike },
  { value: "caminhao", label: "Caminhão", icon: Truck },
  { value: "van", label: "Van", icon: Bus },
  { value: "onibus", label: "Ônibus", icon: Bus },
];

const carSteps = [
  { id: 1, title: "Identificação", description: "Categoria e carroceria" },
  { id: 2, title: "Dados Técnicos", description: "Informações do veículo" },
  { id: 3, title: "Histórico", description: "Procedência e condições" },
  { id: 4, title: "Diagnóstico", description: "Avaliação Zé do Rolo" },
  { id: 5, title: "Negócio Ideal", description: "Preferências de troca" },
  { id: 6, title: "Fotos", description: "Galeria completa" },
];

const truckSteps = [
  { id: 1, title: "Tipo", description: "Categoria do pesado" },
  { id: 2, title: "Especificações", description: "Dados técnicos" },
  { id: 3, title: "Configuração", description: "Tração e carroceria" },
  { id: 4, title: "Detalhes", description: "Opcionais e acabamento" },
  { id: 5, title: "Histórico", description: "Procedência e segurança" },
  { id: 6, title: "Diagnóstico", description: "Avaliação Zé do Rolo" },
  { id: 7, title: "Negócio Ideal", description: "Preferências de troca" },
  { id: 8, title: "Fotos", description: "Galeria 360° pesados" },
];

const vanSteps = [
  { id: 1, title: "Carroceria", description: "Tipo da van" },
  { id: 2, title: "Especificações", description: "Dados técnicos" },
  { id: 3, title: "Detalhes", description: "Opcionais e acabamento" },
  { id: 4, title: "Conforto", description: "Itens de conforto" },
  { id: 5, title: "Histórico", description: "Procedência e segurança" },
  { id: 6, title: "Diagnóstico", description: "Avaliação Zé do Rolo" },
  { id: 7, title: "Negócio Ideal", description: "Preferências de troca" },
  { id: 8, title: "Fotos", description: "Galeria 360° vans" },
];

const busSteps = [
  { id: 1, title: "Carroceria", description: "Tipo de ônibus" },
  { id: 2, title: "Especificações", description: "Dados técnicos" },
  { id: 3, title: "Conforto", description: "Capacidade e itens" },
  { id: 4, title: "Itens de Série", description: "Opcionais completos" },
  { id: 5, title: "Histórico", description: "Procedência e segurança" },
  { id: 6, title: "Diagnóstico", description: "Avaliação Zé do Rolo" },
  { id: 7, title: "Negócio Ideal", description: "Preferências de troca" },
  { id: 8, title: "Fotos", description: "Galeria 360° ônibus" },
];

const diagnosticItems = [
  { key: "rating_motor", label: "Motor", description: "Estado geral do motor" },
  { key: "rating_cambio", label: "Câmbio", description: "Funcionamento da transmissão" },
  { key: "rating_freios", label: "Freios", description: "Sistema de frenagem" },
  { key: "rating_estetica", label: "Estética/Pintura", description: "Pintura e aparência externa" },
  { key: "rating_lataria", label: "Lataria", description: "Amassados, arranhões, ferrugem" },
  { key: "rating_suspensao", label: "Suspensão", description: "Sistema de suspensão" },
  { key: "rating_pneus", label: "Pneus", description: "Estado dos pneus" },
  { key: "rating_documentacao", label: "Documentação", description: "Documentos em dia" },
  { key: "rating_mecanica_geral", label: "Mecânica Geral", description: "Funcionamento geral" },
  { key: "rating_eletrica", label: "Elétrica", description: "Sistema elétrico" },
  { key: "rating_interior", label: "Interior", description: "Bancos, painel, acabamento" },
];

const truckDiagnosticItems = [
  { key: "rating_motor", label: "Motor", description: "Ruídos, fumaça, vazamentos" },
  { key: "rating_cambio", label: "Câmbio", description: "Engates e embreagem" },
  { key: "rating_freios", label: "Freios", description: "Sistema de frenagem completo" },
  { key: "rating_estetica", label: "Estética", description: "Pintura e aparência" },
  { key: "rating_suspensao", label: "Suspensão", description: "Molas e amortecedores" },
  { key: "rating_pneus", label: "Pneus/Rodagem", description: "Incluindo quinta roda" },
  { key: "rating_documentacao", label: "Documentação", description: "CRLV, multas, restrições" },
  { key: "rating_mecanica_geral", label: "Mecânica Geral", description: "Funcionamento geral" },
  { key: "rating_eletrica", label: "Elétrica", description: "Faróis, lanternas, painel" },
  { key: "rating_interior", label: "Cabine/Interior", description: "Leito, painel, bancos" },
];

const vanDiagnosticItems = [
  { key: "rating_motor", label: "Motor", description: "Funcionamento e ruídos" },
  { key: "rating_cambio", label: "Câmbio", description: "Engates e embreagem" },
  { key: "rating_freios", label: "Freios", description: "Sistema de frenagem" },
  { key: "rating_estetica", label: "Estética/Pintura", description: "Aparência externa" },
  { key: "rating_suspensao", label: "Suspensão", description: "Molas e amortecedores" },
  { key: "rating_pneus", label: "Pneus", description: "Estado dos pneus" },
  { key: "rating_documentacao", label: "Documentação", description: "Documentos em dia" },
  { key: "rating_mecanica_geral", label: "Mecânica Geral", description: "Funcionamento geral" },
  { key: "rating_eletrica", label: "Elétrica", description: "Sistema elétrico" },
  { key: "rating_interior", label: "Parte Interna", description: "Bancos, revestimentos, acabamento" },
];

const busDiagnosticItems = [
  { key: "rating_motor", label: "Motor", description: "Fumaça, ruídos, vazamentos" },
  { key: "rating_cambio", label: "Câmbio", description: "Engates e embreagem" },
  { key: "rating_freios", label: "Freios", description: "Sistema de frenagem completo" },
  { key: "rating_estetica", label: "Estética/Pintura", description: "Aparência externa" },
  { key: "rating_suspensao", label: "Suspensão", description: "Molas e amortecedores" },
  { key: "rating_pneus", label: "Pneus", description: "Estado dos pneus" },
  { key: "rating_documentacao", label: "Documentação", description: "CRLV, multas, restrições" },
  { key: "rating_mecanica_geral", label: "Mecânica Geral", description: "Funcionamento geral" },
  { key: "rating_eletrica", label: "Elétrica", description: "Faróis, lanternas, painel" },
  { key: "rating_interior", label: "Parte Interna", description: "Bancos passageiros, acabamento" },
];

const ownershipTimeOptions = [
  { value: "menos_6_meses", label: "Menos de 6 meses" },
  { value: "6_12_meses", label: "6 meses a 1 ano" },
  { value: "1_3_anos", label: "1 a 3 anos" },
  { value: "3_5_anos", label: "3 a 5 anos" },
  { value: "mais_5_anos", label: "Mais de 5 anos" },
];

const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const AddProduct = () => {
  const { user, loading } = useAuth();
  const { isVerified, kycStatus, loading: kycLoading } = useKYCStatus();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
  const [showKYCModal, setShowKYCModal] = useState(false);

  // Handle KYC modal close - redirect user away since they can't access this page
  const handleKYCModalClose = () => {
    setShowKYCModal(false);
    navigate("/");
  };

  const [formData, setFormData] = useState<Record<string, any>>({
    // Etapa 1 - Identificação
    vehicle_type: "carro",
    body_type: "",
    moto_style: "",
    truck_type: "",
    van_subcategory: "",
    bus_subcategory: "",
    
    // Etapa 2 - Dados Técnicos
    city: "", state: "",
    km: "", brand: "", model: "", version: "",
    year_manufacture: "", year_model: "",
    price: "", transmission: "manual", fuel: "flex",
    plate_end: "", is_armored: false, color: "",
    doors: "", engine_liters: "", seats: "",
    // Campos específicos de Motos
    cylinders: "", start_type: "", motor_type: "", brake_type: "", fuel_system: "",
    // Campos específicos de Caminhões
    truck_traction: "", truck_body: "", truck_cabin: "",
    truck_optionals: [] as string[],
    // Campos específicos de Vans
    van_traction: "", steering_type: "", window_type: "",
    van_optionals: [] as string[],
    // Campos específicos de Ônibus
    bus_traction: "",
    bus_optionals: [] as string[],
    
    // Etapa 3 - Histórico
    is_auction: false, auction_reason: "",
    insurance_covers_100: "", insurance_coverage_percent: "",
    accepts_trade: true, is_financed: false, has_warranty: false,
    ipva_paid: false, is_single_owner: false,
    is_chassis_remarked: false,
    moto_optionals: [] as string[],
    
    // Etapa 4 - Diagnóstico
    rating_motor: 5, rating_cambio: 5, rating_freios: 5, 
    rating_estetica: 5, rating_lataria: 5, rating_suspensao: 5, 
    rating_pneus: 5, rating_documentacao: 5, rating_mecanica_geral: 5, 
    rating_eletrica: 5, rating_interior: 5,
    diagnostic_notes: "", ownership_time: "",
    
    // Etapa 5 - Negócio Ideal
    trade_priority: "dinheiro",
    min_cash_return: "", max_cash_return: "",
    trade_restrictions: [] as string[],
    ideal_trade_description: "",
    
    // Etapa 6 - Fotos
    description: "",
  });

  // Seleciona os steps baseado no tipo de veículo
  const getSteps = () => {
    if (formData.vehicle_type === "caminhao") return truckSteps;
    if (formData.vehicle_type === "van") return vanSteps;
    if (formData.vehicle_type === "onibus") return busSteps;
    return carSteps;
  };
  const steps = getSteps();
  
  const getDiagnosticItems = () => {
    if (formData.vehicle_type === "caminhao") return truckDiagnosticItems;
    if (formData.vehicle_type === "van") return vanDiagnosticItems;
    if (formData.vehicle_type === "onibus") return busDiagnosticItems;
    return diagnosticItems;
  };
  const currentDiagnosticItems = getDiagnosticItems();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  // Show KYC modal if user is not verified
  useEffect(() => {
    if (!loading && !kycLoading && user && !isVerified) {
      setShowKYCModal(true);
    }
  }, [loading, kycLoading, user, isVerified]);

  const handleImageUpload = (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImages(prev => ({ ...prev, [photoId]: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreviews(prev => ({ ...prev, [photoId]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (photoId: string) => {
    setImages(prev => {
      const updated = { ...prev };
      delete updated[photoId];
      return updated;
    });
    setImagePreviews(prev => {
      const updated = { ...prev };
      delete updated[photoId];
      return updated;
    });
  };

  const getRequiredPhotos = () => {
    if (formData.vehicle_type === "moto") {
      return Object.values(motoPhotoCategories)
        .flatMap((cat) => cat.photos)
        .filter((p) => p.required);
    }
    if (formData.vehicle_type === "caminhao") {
      return Object.values(truckPhotoCategories)
        .flatMap((cat) => cat.photos)
        .filter((p) => p.required);
    }
    if (formData.vehicle_type === "van") {
      return Object.values(vanPhotoCategories)
        .flatMap((cat) => cat.photos)
        .filter((p) => p.required);
    }
    if (formData.vehicle_type === "onibus") {
      return Object.values(busPhotoCategories)
        .flatMap((cat) => cat.photos)
        .filter((p) => p.required);
    }
    return Object.values(photoCategories)
      .flatMap((cat) => cat.photos)
      .filter((p) => p.required);
  };

  const validateStep = (stepNumber: number): boolean => {
    // Para caminhões, a validação é diferente
    if (formData.vehicle_type === "caminhao") {
      switch (stepNumber) {
        case 1:
          if (!formData.truck_type) {
            toast({ title: "Selecione o tipo de caminhão", variant: "destructive" });
            return false;
          }
          return true;
        case 2:
          if (!formData.brand || !formData.model || !formData.year_manufacture || !formData.price) {
            toast({ title: "Preencha marca, modelo, ano e preço", variant: "destructive" });
            return false;
          }
          return true;
        default:
          return true;
      }
    }
    
    // Para vans, a validação é diferente
    if (formData.vehicle_type === "van") {
      switch (stepNumber) {
        case 1:
          if (!formData.van_subcategory) {
            toast({ title: "Selecione o tipo de carroceria da van", variant: "destructive" });
            return false;
          }
          return true;
        case 2:
          if (!formData.brand || !formData.model || !formData.year_manufacture || !formData.price) {
            toast({ title: "Preencha marca, modelo, ano e preço", variant: "destructive" });
            return false;
          }
          return true;
        default:
          return true;
      }
    }
    
    // Para ônibus, a validação é diferente
    if (formData.vehicle_type === "onibus") {
      switch (stepNumber) {
        case 1:
          if (!formData.bus_subcategory) {
            toast({ title: "Selecione o tipo de ônibus", variant: "destructive" });
            return false;
          }
          return true;
        case 2:
          if (!formData.brand || !formData.model || !formData.year_manufacture || !formData.price) {
            toast({ title: "Preencha marca, modelo, ano e preço", variant: "destructive" });
            return false;
          }
          return true;
        default:
          return true;
      }
    }
    
    // Para carros e motos
    switch (stepNumber) {
      case 1:
        if (!formData.vehicle_type) {
          toast({ title: "Selecione o tipo de veículo", variant: "destructive" });
          return false;
        }
        if (formData.vehicle_type === "carro" && !formData.body_type) {
          toast({ title: "Selecione o tipo de carroceria", variant: "destructive" });
          return false;
        }
        if (formData.vehicle_type === "moto" && !formData.moto_style) {
          toast({ title: "Selecione o estilo da moto", variant: "destructive" });
          return false;
        }
        return true;
      case 2:
        if (!formData.brand || !formData.model || !formData.year_manufacture || !formData.price) {
          toast({ title: "Preencha marca, modelo, ano e preço", variant: "destructive" });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, steps.length));
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < step) {
      setStep(stepId);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    const requiredPhotos = getRequiredPhotos();
    const missingPhotos = requiredPhotos.filter(p => !images[p.id]);
    if (missingPhotos.length > 0) {
      toast({ 
        title: "Fotos obrigatórias faltando", 
        description: `Adicione: ${missingPhotos.slice(0, 3).map(p => p.label).join(", ")}${missingPhotos.length > 3 ? ` e mais ${missingPhotos.length - 3}` : ""}`, 
        variant: "destructive" 
      });
      return;
    }

    setSubmitting(true);
    try {
      const vehicleData = {
        user_id: user.id,
        vehicle_type: formData.vehicle_type,
        title: `${formData.brand} ${formData.model} ${formData.year_model || formData.year_manufacture}`,
        brand: formData.brand, 
        model: formData.model, 
        version: formData.version || null,
        year_manufacture: parseInt(formData.year_manufacture),
        year_model: parseInt(formData.year_model || formData.year_manufacture),
        plate_end: formData.plate_end || null,
        km: parseInt(formData.km) || 0, 
        color: formData.color,
        transmission: formData.vehicle_type === "moto" ? "manual" : formData.transmission, 
        fuel: formData.fuel,
        doors: formData.doors ? parseInt(formData.doors) : null,
        engine: formData.engine_liters || null,
        price: parsePriceInput(formData.price), 
        accepts_trade: formData.accepts_trade,
        city: formData.city || null, 
        state: formData.state || null,
        description: formData.description || null, 
        diagnostic_notes: formData.diagnostic_notes || null,
        body_type: formData.body_type || null,
        is_armored: formData.is_armored,
        van_subcategory: formData.vehicle_type === "van" ? formData.van_subcategory : null,
        
        // Campos específicos de Moto
        moto_style: formData.vehicle_type === "moto" ? formData.moto_style : null,
        cylinders: formData.cylinders ? parseInt(formData.cylinders) : null,
        start_type: formData.start_type || null,
        motor_type: formData.motor_type || null,
        brake_type: formData.brake_type || null,
        fuel_system: formData.fuel_system || null,
        moto_optionals: formData.moto_optionals.length > 0 ? formData.moto_optionals : null,
        is_chassis_remarked: formData.is_chassis_remarked,
        
        // Ratings
        rating_motor: formData.rating_motor, 
        rating_cambio: formData.rating_cambio,
        rating_freios: formData.rating_freios, 
        rating_estetica: formData.rating_estetica,
        rating_lataria: formData.rating_lataria,
        rating_suspensao: formData.rating_suspensao, 
        rating_pneus: formData.rating_pneus,
        rating_documentacao: formData.rating_documentacao, 
        rating_mecanica_geral: formData.rating_mecanica_geral,
        rating_eletrica: formData.rating_eletrica,
        rating_interior: formData.rating_interior,
        
        // Trade info
        ideal_trade_description: formData.ideal_trade_description || null,
        trade_value_accepted: formData.max_cash_return ? parsePriceInput(formData.max_cash_return) : null,
        min_cash_return: formData.min_cash_return ? parsePriceInput(formData.min_cash_return) : null,
        ownership_time: formData.ownership_time || null,
        
        // History
        is_auction: formData.is_auction, 
        auction_reason: formData.is_auction ? formData.auction_reason : null,
        is_single_owner: formData.is_single_owner,
        ipva_paid: formData.ipva_paid, 
        has_service_history: formData.has_warranty,
        
        // New fields
        seats: formData.seats ? parseInt(formData.seats) : null,
        is_financed: formData.is_financed,
        has_warranty: formData.has_warranty,
        insurance_covers_100: formData.insurance_covers_100 || null,
        insurance_coverage_percent: formData.insurance_coverage_percent ? parseInt(formData.insurance_coverage_percent) : null,
        trade_priority: formData.trade_priority,
        max_cash_return: formData.max_cash_return ? parsePriceInput(formData.max_cash_return) : null,
        trade_restrictions: formData.trade_restrictions.length > 0 ? formData.trade_restrictions : null,
      };

      const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .insert(vehicleData as any)
        .select()
        .single();
        
      if (vehicleError) throw vehicleError;

      // Upload images
      const uploadPromises = Object.entries(images).map(async ([photoId, file]) => {
        if (!file) return;
        const fileName = `${user.id}/${vehicle.id}/${photoId}.${file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from("vehicle-images").upload(fileName, file);
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from("vehicle-images").getPublicUrl(fileName);
          await supabase.from("vehicle_images").insert({ 
            vehicle_id: vehicle.id, 
            image_url: publicUrl, 
            image_type: photoId, 
            is_primary: photoId === "frente" 
          });
        }
      });

      await Promise.all(uploadPromises);

      toast({ 
        title: "Veículo cadastrado!", 
        description: "Seu anúncio foi enviado para aprovação e estará disponível em breve." 
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error:", error);
      toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const currentBrands = brands[formData.vehicle_type as keyof typeof brands] || brands.carro;

  if (loading || kycLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* KYC Required Modal */}
      <KYCRequiredModal 
        isOpen={showKYCModal} 
        onClose={handleKYCModalClose} 
        kycStatus={kycStatus}
      />
      <main className="container py-8 max-w-5xl">
        {/* Step Indicator */}
        <StepIndicator 
          steps={steps} 
          currentStep={step} 
          onStepClick={handleStepClick}
        />

        <div className="bg-card rounded-xl border p-6 md:p-8">
          {/* Etapa 1 - Identificação */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Identificação do Veículo</h2>
                <p className="text-muted-foreground mt-1">Selecione a categoria e tipo do seu veículo</p>
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-semibold">Categoria do Veículo</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {vehicleTypes.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button 
                        key={t.value} 
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, vehicle_type: t.value, brand: "", body_type: "" }))}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                          formData.vehicle_type === t.value 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className={`h-8 w-8 ${formData.vehicle_type === t.value ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-medium ${formData.vehicle_type === t.value ? "text-primary" : ""}`}>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.vehicle_type === "carro" && (
                <div className="pt-4 border-t">
                  <Label className="text-base font-semibold">Tipo de Carroceria *</Label>
                  <div className="mt-3">
                    <CarBodyTypeSelector
                      value={formData.body_type}
                      onChange={(value) => setFormData(p => ({ ...p, body_type: value }))}
                    />
                  </div>
                </div>
              )}

              {formData.vehicle_type === "moto" && (
                <div className="pt-4 border-t">
                  <Label className="text-base font-semibold">Estilo da Moto *</Label>
                  <p className="text-sm text-muted-foreground mb-3">Selecione o estilo que melhor descreve sua moto</p>
                  <MotoStyleSelector
                    value={formData.moto_style}
                    onChange={(value) => setFormData(p => ({ ...p, moto_style: value }))}
                  />
                </div>
              )}

              {formData.vehicle_type === "caminhao" && (
                <div className="pt-4 border-t">
                  <Label className="text-base font-semibold">Tipo de Caminhão/Pesado *</Label>
                  <p className="text-sm text-muted-foreground mb-3">Selecione a categoria que melhor descreve seu veículo</p>
                  <TruckTypeSelector
                    value={formData.truck_type}
                    onChange={(value) => setFormData(p => ({ ...p, truck_type: value }))}
                  />
                </div>
              )}

              {formData.vehicle_type === "van" && (
                <div className="pt-4 border-t">
                  <Label className="text-base font-semibold">Tipo de Carroceria *</Label>
                  <p className="text-sm text-muted-foreground mb-3">Selecione o tipo que melhor descreve sua van</p>
                  <VanTypeSelector
                    value={formData.van_subcategory}
                    onChange={(value) => setFormData(p => ({ ...p, van_subcategory: value }))}
                  />
                </div>
              )}

              {formData.vehicle_type === "onibus" && (
                <div className="pt-4 border-t">
                  <Label className="text-base font-semibold">Tipo de Ônibus *</Label>
                  <p className="text-sm text-muted-foreground mb-3">Selecione o tipo que melhor descreve seu ônibus</p>
                  <BusTypeSelector
                    value={formData.bus_subcategory}
                    onChange={(value) => setFormData(p => ({ ...p, bus_subcategory: value }))}
                  />
                </div>
              )}
            </div>
          )}
          {/* Etapa 2 - Dados Técnicos */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Dados Técnicos</h2>
                <p className="text-muted-foreground mt-1">Preencha as informações do veículo</p>
              </div>

              {/* FIPE Consultation Link */}
              <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-medium text-sm">Não sabe o preço do seu veículo?</p>
                      <p className="text-xs text-muted-foreground">Consulte a Tabela FIPE para obter o valor de referência</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/tabela-fipe" target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Consultar FIPE
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Localização */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Cidade</Label>
                  <Input 
                    value={formData.city} 
                    onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} 
                    placeholder="Ex: São Paulo"
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select value={formData.state} onValueChange={v => setFormData(p => ({ ...p, state: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {brazilianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quilometragem */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Quilometragem *</Label>
                  <Input 
                    type="number" 
                    value={formData.km} 
                    onChange={e => setFormData(p => ({ ...p, km: e.target.value }))} 
                    placeholder="Ex: 45000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Se 0km, deixe em branco ou 0</p>
                </div>
              </div>

              {/* Marca, Modelo, Versão */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Marca *</Label>
                  <Select value={formData.brand} onValueChange={v => setFormData(p => ({ ...p, brand: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card max-h-60">
                      {currentBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Modelo *</Label>
                  <Input value={formData.model} onChange={e => setFormData(p => ({ ...p, model: e.target.value }))} placeholder="Ex: Civic" />
                </div>
                <div>
                  <Label>Versão</Label>
                  <Input value={formData.version} onChange={e => setFormData(p => ({ ...p, version: e.target.value }))} placeholder="Ex: EXL 2.0" />
                </div>
              </div>

              {/* Anos */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Ano Fabricação *</Label>
                  <Input type="number" value={formData.year_manufacture} onChange={e => setFormData(p => ({ ...p, year_manufacture: e.target.value }))} placeholder="Ex: 2022" />
                </div>
                <div>
                  <Label>Ano Modelo</Label>
                  <Input type="number" value={formData.year_model} onChange={e => setFormData(p => ({ ...p, year_model: e.target.value }))} placeholder="Ex: 2023" />
                </div>
              </div>

              {/* Preço e Combustível */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Preço (R$) *</Label>
                  <Input 
                    type="text" 
                    inputMode="numeric"
                    value={formData.price} 
                    onChange={e => setFormData(p => ({ ...p, price: formatPriceInput(e.target.value) }))} 
                    placeholder="Ex: 85.000" 
                  />
                </div>
                {formData.vehicle_type !== "moto" && (
                  <div>
                    <Label>Câmbio</Label>
                    <Select value={formData.transmission} onValueChange={v => setFormData(p => ({ ...p, transmission: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card">
                        {transmissionTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label>Combustível</Label>
                  <Select value={formData.fuel} onValueChange={v => setFormData(p => ({ ...p, fuel: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {fuelTypes.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Campos específicos para MOTO */}
              {formData.vehicle_type === "moto" && (
                <>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label>Cilindradas *</Label>
                      <Select value={formData.cylinders} onValueChange={v => setFormData(p => ({ ...p, cylinders: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent className="bg-card">
                          {cylinderRanges.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tipo de Partida</Label>
                      <Select value={formData.start_type} onValueChange={v => setFormData(p => ({ ...p, start_type: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent className="bg-card">
                          {motoStartTypes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tipo de Motor</Label>
                      <Select value={formData.motor_type} onValueChange={v => setFormData(p => ({ ...p, motor_type: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent className="bg-card">
                          {motoMotorTypes.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label>Freios</Label>
                      <Select value={formData.brake_type} onValueChange={v => setFormData(p => ({ ...p, brake_type: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent className="bg-card">
                          {motoBrakeTypes.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Alimentação</Label>
                      <Select value={formData.fuel_system} onValueChange={v => setFormData(p => ({ ...p, fuel_system: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent className="bg-card">
                          {motoFuelSystems.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Cor</Label>
                      <Select value={formData.color} onValueChange={v => setFormData(p => ({ ...p, color: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent className="bg-card max-h-60">
                          {colorOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Opcionais da Moto */}
                  <div className="p-4 border rounded-lg space-y-3">
                    <Label className="text-base font-semibold">Opcionais</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {motoOptionals.map(opt => (
                        <div key={opt.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`opt-${opt.value}`}
                            checked={formData.moto_optionals.includes(opt.value)}
                            onCheckedChange={(checked) => {
                              const newOpts = checked 
                                ? [...formData.moto_optionals, opt.value]
                                : formData.moto_optionals.filter((o: string) => o !== opt.value);
                              setFormData(p => ({ ...p, moto_optionals: newOpts }));
                            }}
                          />
                          <Label htmlFor={`opt-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Final da Placa, Blindagem, Cor */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Final da Placa</Label>
                  <Select value={formData.plate_end} onValueChange={v => setFormData(p => ({ ...p, plate_end: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {[0,1,2,3,4,5,6,7,8,9].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Blindagem</Label>
                  <div className="flex items-center gap-3 h-10 px-3 border rounded-md bg-background">
                    <Switch 
                      checked={formData.is_armored} 
                      onCheckedChange={v => setFormData(p => ({ ...p, is_armored: v }))} 
                    />
                    <span className="text-sm">{formData.is_armored ? "Blindado" : "Não blindado"}</span>
                  </div>
                </div>
                <div>
                  <Label>Cor</Label>
                  <Select value={formData.color} onValueChange={v => setFormData(p => ({ ...p, color: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card max-h-60">
                      {colorOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Portas, Motor, Lugares */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Portas</Label>
                  <Select value={formData.doors} onValueChange={v => setFormData(p => ({ ...p, doors: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {doorOptions.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Motor (Litragem)</Label>
                  <Select value={formData.engine_liters} onValueChange={v => setFormData(p => ({ ...p, engine_liters: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card max-h-60">
                      {engineLiters.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Lugares</Label>
                  <Select value={formData.seats} onValueChange={v => setFormData(p => ({ ...p, seats: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {seatOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Etapa 3 - Configuração de Carga (SOMENTE CAMINHÕES) */}
          {step === 3 && formData.vehicle_type === "caminhao" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Configuração de Carga</h2>
                <p className="text-muted-foreground mt-1">Especificações de tração, carroceria e cabine</p>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
                <Settings2 className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary">Configuração Essencial</p>
                  <p className="text-sm text-muted-foreground">
                    Estas informações são cruciais para compradores que buscam um caminhão para trabalho específico.
                  </p>
                </div>
              </div>

              {/* Tração */}
              <div className="p-4 border rounded-lg space-y-3">
                <Label className="text-base font-semibold">Tração *</Label>
                <p className="text-sm text-muted-foreground">Selecione a configuração de eixos</p>
                <div className="flex flex-wrap gap-2">
                  {truckTractions.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, truck_traction: t.value }))}
                      className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                        formData.truck_traction === t.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carroceria */}
              <div className="p-4 border rounded-lg space-y-3">
                <Label className="text-base font-semibold">Tipo de Carroceria</Label>
                <p className="text-sm text-muted-foreground">Caso não tenha carroceria, deixe em branco</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {truckBodies.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, truck_body: formData.truck_body === b.value ? "" : b.value }))}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium text-center ${
                        formData.truck_body === b.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cabine */}
              <div className="p-4 border rounded-lg space-y-3">
                <Label className="text-base font-semibold">Tipo de Cabine *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {truckCabins.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, truck_cabin: c.value }))}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium text-center ${
                        formData.truck_cabin === c.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 4 - Detalhes e Opcionais (SOMENTE CAMINHÕES) */}
          {step === 4 && formData.vehicle_type === "caminhao" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Detalhes e Opcionais</h2>
                <p className="text-muted-foreground mt-1">Acabamentos e equipamentos do veículo</p>
              </div>

              {/* Detalhes básicos */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Final da Placa</Label>
                  <Select value={formData.plate_end} onValueChange={v => setFormData(p => ({ ...p, plate_end: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {[0,1,2,3,4,5,6,7,8,9].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cor</Label>
                  <Select value={formData.color} onValueChange={v => setFormData(p => ({ ...p, color: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card max-h-60">
                      {colorOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Lugares/Ocupantes</Label>
                  <Select value={formData.seats} onValueChange={v => setFormData(p => ({ ...p, seats: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {truckSeatOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Motor (Litragem)</Label>
                  <Select value={formData.engine_liters} onValueChange={v => setFormData(p => ({ ...p, engine_liters: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card max-h-60">
                      {engineLiters.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Portas</Label>
                  <Select value={formData.doors} onValueChange={v => setFormData(p => ({ ...p, doors: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {doorOptions.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Blindagem</Label>
                  <div className="flex items-center gap-3 h-10 px-3 border rounded-md bg-background">
                    <Switch 
                      checked={formData.is_armored} 
                      onCheckedChange={v => setFormData(p => ({ ...p, is_armored: v }))} 
                    />
                    <span className="text-sm">{formData.is_armored ? "Sim" : "Não"}</span>
                  </div>
                </div>
              </div>

              {/* Opcionais do Caminhão */}
              <div className="p-4 border rounded-lg space-y-3">
                <Label className="text-base font-semibold">Opcionais</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {truckOptionals.map(opt => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`truck-opt-${opt.value}`}
                        checked={formData.truck_optionals.includes(opt.value)}
                        onCheckedChange={(checked) => {
                          const newOpts = checked 
                            ? [...formData.truck_optionals, opt.value]
                            : formData.truck_optionals.filter((o: string) => o !== opt.value);
                          setFormData(p => ({ ...p, truck_optionals: newOpts }));
                        }}
                      />
                      <Label htmlFor={`truck-opt-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 5 - Histórico e Segurança (CAMINHÕES) */}
          {step === 5 && formData.vehicle_type === "caminhao" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Histórico e Segurança</h2>
                <p className="text-muted-foreground mt-1">Informações sobre procedência e condições legais</p>
              </div>

              {/* Leilão */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <Label className="text-base">Veículo de Leilão?</Label>
                      <p className="text-sm text-muted-foreground">Informe se o veículo tem passagem por leilão</p>
                    </div>
                  </div>
                  <Switch 
                    checked={formData.is_auction} 
                    onCheckedChange={v => setFormData(p => ({ ...p, is_auction: v }))} 
                  />
                </div>
                
                {formData.is_auction && (
                  <div>
                    <Label>Motivo do Leilão (detalhe)</Label>
                    <Textarea 
                      value={formData.auction_reason} 
                      onChange={e => setFormData(p => ({ ...p, auction_reason: e.target.value }))} 
                      placeholder="Ex: Recuperado de sinistro, renovação de frota da empresa X..."
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {/* Seguro e Financeiro */}
              <div className="p-4 border rounded-lg space-y-4">
                <div>
                  <Label className="text-base">Seguro cobre 100%?</Label>
                </div>
                <Select value={formData.insurance_covers_100} onValueChange={v => setFormData(p => ({ ...p, insurance_covers_100: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent className="bg-card">
                    {insuranceOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Características */}
              <div className="p-4 border rounded-lg space-y-4">
                <Label className="text-base">Condições do Veículo</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>Chassis Remarcado</Label>
                    <Switch checked={formData.is_chassis_remarked} onCheckedChange={v => setFormData(p => ({ ...p, is_chassis_remarked: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>Alienado/Financiado</Label>
                    <Switch checked={formData.is_financed} onCheckedChange={v => setFormData(p => ({ ...p, is_financed: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>Aceita Troca</Label>
                    <Switch checked={formData.accepts_trade} onCheckedChange={v => setFormData(p => ({ ...p, accepts_trade: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>IPVA Pago</Label>
                    <Switch checked={formData.ipva_paid} onCheckedChange={v => setFormData(p => ({ ...p, ipva_paid: v }))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Etapa 6 - Diagnóstico (CAMINHÕES) */}
          {step === 6 && formData.vehicle_type === "caminhao" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Diagnóstico Zé do Rolo - Pesados</h2>
                <p className="text-muted-foreground mt-1">Avalie cada item de 0 a 10 com total honestidade</p>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary">Não omita nada!</p>
                  <p className="text-sm text-muted-foreground">
                    A transparência gera negócios. Compradores de caminhões buscam confiança acima de tudo.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {truckDiagnosticItems.map((item) => (
                  <DiagnosticSlider
                    key={item.key}
                    label={item.label}
                    description={item.description}
                    value={formData[item.key]}
                    onChange={(v) => setFormData(p => ({ ...p, [item.key]: v }))}
                  />
                ))}
              </div>

              <div>
                <Label className="text-base font-semibold">Observações e Problemas</Label>
                <p className="text-sm text-muted-foreground mb-2">Descreva qualquer detalhe importante</p>
                <Textarea 
                  value={formData.diagnostic_notes} 
                  onChange={e => setFormData(p => ({ ...p, diagnostic_notes: e.target.value }))} 
                  placeholder="Ex: Quinta roda com folga, precisando de troca em 6 meses. Câmbio com leve dificuldade no 3º..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Há quanto tempo você possui o veículo?</Label>
                <Select value={formData.ownership_time} onValueChange={v => setFormData(p => ({ ...p, ownership_time: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent className="bg-card">
                    {ownershipTimeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Etapa 7 - Negócio Ideal (CAMINHÕES) */}
          {step === 7 && formData.vehicle_type === "caminhao" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">O Negócio Ideal - Alto Valor</h2>
                <p className="text-muted-foreground mt-1">Configure suas preferências de troca para veículos pesados</p>
              </div>

              {/* Prioridade */}
              <div className="p-4 border rounded-lg space-y-3">
                <Label className="text-base font-semibold">Qual sua prioridade?</Label>
                <div className="grid grid-cols-3 gap-3">
                  {tradePriorityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, trade_priority: opt.value }))}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.trade_priority === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className={`text-sm font-medium ${formData.trade_priority === opt.value ? "text-primary" : ""}`}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Valores de volta */}
              {formData.accepts_trade && (
                <div className="p-4 border rounded-lg space-y-4">
                  <Label className="text-base font-semibold">Valores de Volta (R$)</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Valor mínimo de volta</Label>
                      <Input 
                        type="text" 
                        inputMode="numeric"
                        value={formData.min_cash_return} 
                        onChange={e => setFormData(p => ({ ...p, min_cash_return: formatPriceInput(e.target.value) }))} 
                        placeholder="Ex: 50.000"
                      />
                    </div>
                    <div>
                      <Label>Valor máximo de volta</Label>
                      <Input 
                        type="text" 
                        inputMode="numeric"
                        value={formData.max_cash_return} 
                        onChange={e => setFormData(p => ({ ...p, max_cash_return: formatPriceInput(e.target.value) }))} 
                        placeholder="Ex: 200.000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Restrições */}
              {formData.accepts_trade && (
                <div className="p-4 border rounded-lg space-y-4">
                  <div>
                    <Label className="text-base font-semibold">NÃO ACEITO DE JEITO NENHUM</Label>
                    <p className="text-sm text-muted-foreground">Inclua implementos, imóveis, veículos indesejados</p>
                  </div>
                  <TradeRestrictionsInput
                    value={formData.trade_restrictions}
                    onChange={(v) => setFormData(p => ({ ...p, trade_restrictions: v }))}
                  />
                </div>
              )}

              {/* Descrição */}
              <div>
                <Label className="text-base font-semibold">Descreva a troca ideal</Label>
                <Textarea 
                  value={formData.ideal_trade_description} 
                  onChange={e => setFormData(p => ({ ...p, ideal_trade_description: e.target.value }))} 
                  placeholder="Ex: Aceito cavalo mecânico 6x2 de menor valor + volta. Tenho interesse em implementos graneleiros..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Etapa 8 - Fotos (CAMINHÕES) */}
          {step === 8 && formData.vehicle_type === "caminhao" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Galeria 360° - Pesados</h2>
                <p className="text-muted-foreground mt-1">Fotografe todos os ângulos do veículo</p>
              </div>

              <TruckPhotoUploadGrid
                images={images}
                previews={imagePreviews}
                onUpload={handleImageUpload}
                onRemove={handleRemoveImage}
              />

              {/* Descrição */}
              <div>
                <Label className="text-base font-semibold">Descrição do Anúncio</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
                  placeholder="Ex: Caminhão sempre rodou regional, manutenção em dia, pneus novos..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* ============= ETAPAS ESPECÍFICAS PARA ÔNIBUS ============= */}
          
          {/* Etapa 3 - Conforto e Capacidade (ÔNIBUS) */}
          {step === 3 && formData.vehicle_type === "onibus" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Conforto e Capacidade</h2>
                <p className="text-muted-foreground mt-1">Detalhes de acomodação do ônibus</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Lugares/Ocupantes *</Label>
                  <Input 
                    type="number" 
                    value={formData.seats} 
                    onChange={e => setFormData(p => ({ ...p, seats: e.target.value }))} 
                    placeholder="Ex: 46"
                    min="1"
                    max="99"
                  />
                </div>
                <div>
                  <Label>Portas</Label>
                  <Select value={formData.doors} onValueChange={v => setFormData(p => ({ ...p, doors: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {[1,2,3,4,5,6,7,8,9].map(n => <SelectItem key={n} value={n.toString()}>{n} porta(s)</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Motor (Litragem)</Label>
                  <Select value={formData.engine_liters} onValueChange={v => setFormData(p => ({ ...p, engine_liters: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card max-h-60">
                      {engineLiters.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Tração</Label>
                  <Select value={formData.bus_traction} onValueChange={v => setFormData(p => ({ ...p, bus_traction: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {busTractions.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Direção</Label>
                  <Select value={formData.steering_type} onValueChange={v => setFormData(p => ({ ...p, steering_type: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      {steeringTypes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Bancos</Label>
                  <Select value={formData.seat_material} onValueChange={v => setFormData(p => ({ ...p, seat_material: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="couro">Couro</SelectItem>
                      <SelectItem value="tecido">Tecido</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Etapa 4 - Itens de Série (ÔNIBUS) */}
          {step === 4 && formData.vehicle_type === "onibus" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Itens de Série</h2>
                <p className="text-muted-foreground mt-1">Opcionais e equipamentos do ônibus</p>
              </div>

              <div className="p-4 border rounded-lg space-y-3">
                <Label className="text-base font-semibold">Opcionais</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {busOptionals.map(opt => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`bus-opt-${opt.value}`}
                        checked={formData.bus_optionals.includes(opt.value)}
                        onCheckedChange={(checked) => {
                          const newOpts = checked 
                            ? [...formData.bus_optionals, opt.value]
                            : formData.bus_optionals.filter((o: string) => o !== opt.value);
                          setFormData(p => ({ ...p, bus_optionals: newOpts }));
                        }}
                      />
                      <Label htmlFor={`bus-opt-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 5 - Histórico e Segurança (ÔNIBUS) */}
          {step === 5 && formData.vehicle_type === "onibus" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Histórico e Segurança</h2>
                <p className="text-muted-foreground mt-1">Informações sobre procedência e condições legais</p>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary">Seja honesto(a), não omita nada!</p>
                  <p className="text-sm text-muted-foreground">O Zé do Rolo busca transparência total para negócios sem surpresas.</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <Label className="text-base">Veículo de Leilão?</Label>
                      <p className="text-sm text-muted-foreground">Informe se o veículo tem passagem por leilão</p>
                    </div>
                  </div>
                  <Switch checked={formData.is_auction} onCheckedChange={v => setFormData(p => ({ ...p, is_auction: v }))} />
                </div>
                {formData.is_auction && (
                  <Textarea value={formData.auction_reason} onChange={e => setFormData(p => ({ ...p, auction_reason: e.target.value }))} placeholder="Descreva o motivo do leilão..." rows={2} />
                )}
              </div>

              <div className="p-4 border rounded-lg space-y-4">
                <Label className="text-base">Condições do Veículo</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>Chassis Remarcado</Label>
                    <Switch checked={formData.is_chassis_remarked} onCheckedChange={v => setFormData(p => ({ ...p, is_chassis_remarked: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>Blindagem</Label>
                    <Switch checked={formData.is_armored} onCheckedChange={v => setFormData(p => ({ ...p, is_armored: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>Alienado/Financiado</Label>
                    <Switch checked={formData.is_financed} onCheckedChange={v => setFormData(p => ({ ...p, is_financed: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>IPVA Pago</Label>
                    <Switch checked={formData.ipva_paid} onCheckedChange={v => setFormData(p => ({ ...p, ipva_paid: v }))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Etapa 6 - Diagnóstico (ÔNIBUS) */}
          {step === 6 && formData.vehicle_type === "onibus" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Diagnóstico Zé do Rolo - Ônibus</h2>
                <p className="text-muted-foreground mt-1">Avalie cada item de 0 a 10 com total honestidade</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {busDiagnosticItems.map((item) => (
                  <DiagnosticSlider key={item.key} label={item.label} description={item.description} value={formData[item.key]} onChange={(v) => setFormData(p => ({ ...p, [item.key]: v }))} />
                ))}
              </div>

              <div>
                <Label className="text-base font-semibold">Observações e Problemas</Label>
                <Textarea value={formData.diagnostic_notes} onChange={e => setFormData(p => ({ ...p, diagnostic_notes: e.target.value }))} placeholder="Ex: Ar condicionado precisando de manutenção na 3ª fileira..." rows={4} />
              </div>
            </div>
          )}

          {/* Etapa 7 - Negócio Ideal (ÔNIBUS) */}
          {step === 7 && formData.vehicle_type === "onibus" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">O Negócio Ideal</h2>
                <p className="text-muted-foreground mt-1">Configure suas preferências de troca</p>
              </div>

              <div className="p-4 border rounded-lg space-y-3">
                <Label className="text-base font-semibold">Qual sua prioridade?</Label>
                <div className="grid grid-cols-3 gap-3">
                  {tradePriorityOptions.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setFormData(p => ({ ...p, trade_priority: opt.value }))} className={`p-4 rounded-lg border-2 text-center transition-all ${formData.trade_priority === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <span className={`text-sm font-medium ${formData.trade_priority === opt.value ? "text-primary" : ""}`}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.accepts_trade && (
                <>
                  <div className="p-4 border rounded-lg space-y-4">
                    <Label className="text-base font-semibold">Valores de Volta (R$)</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Valor mínimo</Label>
                        <Input type="number" value={formData.min_cash_return} onChange={e => setFormData(p => ({ ...p, min_cash_return: e.target.value }))} placeholder="Ex: 50000" />
                      </div>
                      <div>
                        <Label>Valor máximo</Label>
                        <Input type="number" value={formData.max_cash_return} onChange={e => setFormData(p => ({ ...p, max_cash_return: e.target.value }))} placeholder="Ex: 200000" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg space-y-4">
                    <Label className="text-base font-semibold">NÃO ACEITO DE JEITO NENHUM</Label>
                    <TradeRestrictionsInput value={formData.trade_restrictions} onChange={(v) => setFormData(p => ({ ...p, trade_restrictions: v }))} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Etapa 8 - Fotos (ÔNIBUS) */}
          {step === 8 && formData.vehicle_type === "onibus" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Galeria 360° - Ônibus</h2>
                <p className="text-muted-foreground mt-1">Fotografe todos os ângulos do veículo</p>
              </div>

              <BusPhotoUploadGrid images={images} previews={imagePreviews} onUpload={handleImageUpload} onRemove={handleRemoveImage} />

              <div>
                <Label className="text-base font-semibold">Descrição do Anúncio</Label>
                <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Ex: Ônibus rodoviário bem conservado, ar funcionando perfeitamente..." rows={4} />
              </div>
            </div>
          )}

          {/* Etapa 8 - Fotos (VANS) */}
          {step === 8 && formData.vehicle_type === "van" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Galeria 360° - Vans</h2>
                <p className="text-muted-foreground mt-1">Fotografe todos os ângulos do veículo</p>
              </div>

              <VanPhotoUploadGrid
                images={images}
                previews={imagePreviews}
                onUpload={handleImageUpload}
                onRemove={handleRemoveImage}
              />

              <div>
                <Label className="text-base font-semibold">Descrição do Anúncio</Label>
                <p className="text-sm text-muted-foreground mb-2">Adicione informações extras que julgar importantes</p>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
                  placeholder="Ex: Van bem conservada, sempre usada para frete, documentação em dia..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Etapa 3 - Histórico (CARROS E MOTOS) */}
          {step === 3 && formData.vehicle_type !== "caminhao" && formData.vehicle_type !== "onibus" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Checklist e Histórico</h2>
                <p className="text-muted-foreground mt-1">Informações sobre a procedência do veículo</p>
              </div>

              {/* Leilão */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <Label className="text-base">Veículo de Leilão?</Label>
                      <p className="text-sm text-muted-foreground">Informe se o veículo tem passagem por leilão</p>
                    </div>
                  </div>
                  <Switch 
                    checked={formData.is_auction} 
                    onCheckedChange={v => setFormData(p => ({ ...p, is_auction: v }))} 
                  />
                </div>
                
                {formData.is_auction && (
                  <div>
                    <Label>Motivo do Leilão</Label>
                    <Select value={formData.auction_reason} onValueChange={v => setFormData(p => ({ ...p, auction_reason: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                      <SelectContent className="bg-card">
                        {auctionReasons.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Seguro */}
              <div className="p-4 border rounded-lg space-y-4">
                <div>
                  <Label className="text-base">Seguro cobre 100%?</Label>
                  <p className="text-sm text-muted-foreground">Informe a cobertura do seguro</p>
                </div>
                <Select value={formData.insurance_covers_100} onValueChange={v => setFormData(p => ({ ...p, insurance_covers_100: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent className="bg-card">
                    {insuranceOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                
                {formData.insurance_covers_100 === "nao" && (
                  <div>
                    <Label>Percentual de cobertura (%)</Label>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100"
                      value={formData.insurance_coverage_percent} 
                      onChange={e => setFormData(p => ({ ...p, insurance_coverage_percent: e.target.value }))} 
                      placeholder="Ex: 70"
                    />
                  </div>
                )}
              </div>

              {/* Características */}
              <div className="p-4 border rounded-lg space-y-4">
                <Label className="text-base">Características</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>Aceita Troca</Label>
                    <Switch checked={formData.accepts_trade} onCheckedChange={v => setFormData(p => ({ ...p, accepts_trade: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>Alienado/Financiado</Label>
                    <Switch checked={formData.is_financed} onCheckedChange={v => setFormData(p => ({ ...p, is_financed: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>Garantia de Fábrica</Label>
                    <Switch checked={formData.has_warranty} onCheckedChange={v => setFormData(p => ({ ...p, has_warranty: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>IPVA Pago</Label>
                    <Switch checked={formData.ipva_paid} onCheckedChange={v => setFormData(p => ({ ...p, ipva_paid: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <Label>Único Dono</Label>
                    <Switch checked={formData.is_single_owner} onCheckedChange={v => setFormData(p => ({ ...p, is_single_owner: v }))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Etapa 4 - Diagnóstico (CARROS E MOTOS) */}
          {step === 4 && formData.vehicle_type !== "caminhao" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Diagnóstico Zé do Rolo</h2>
                <p className="text-muted-foreground mt-1">Avalie cada item de 0 a 10 com honestidade</p>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary">Transparência Total</p>
                  <p className="text-sm text-muted-foreground">
                    O Zé do Rolo preza pela honestidade. Avalie seu veículo com sinceridade para construir confiança com potenciais compradores.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {diagnosticItems.map((item) => (
                  <DiagnosticSlider
                    key={item.key}
                    label={item.label}
                    description={item.description}
                    value={formData[item.key]}
                    onChange={(v) => setFormData(p => ({ ...p, [item.key]: v }))}
                  />
                ))}
              </div>

              <div>
                <Label className="text-base font-semibold">Observações e Problemas</Label>
                <p className="text-sm text-muted-foreground mb-2">Descreva qualquer problema ou detalhe importante</p>
                <Textarea 
                  value={formData.diagnostic_notes} 
                  onChange={e => setFormData(p => ({ ...p, diagnostic_notes: e.target.value }))} 
                  placeholder="Ex: Arranhão leve na porta traseira direita, ar condicionado precisa recarregar..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Há quanto tempo você possui o veículo?</Label>
                <Select value={formData.ownership_time} onValueChange={v => setFormData(p => ({ ...p, ownership_time: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent className="bg-card">
                    {ownershipTimeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Etapa 5 - Negócio Ideal (CARROS E MOTOS) */}
          {step === 5 && formData.vehicle_type !== "caminhao" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">O Negócio Ideal</h2>
                <p className="text-muted-foreground mt-1">Configure suas preferências de troca</p>
              </div>

              {/* Prioridade */}
              <div className="p-4 border rounded-lg space-y-3">
                <Label className="text-base font-semibold">Qual sua prioridade?</Label>
                <div className="grid grid-cols-3 gap-3">
                  {tradePriorityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, trade_priority: opt.value }))}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.trade_priority === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className={`text-sm font-medium ${formData.trade_priority === opt.value ? "text-primary" : ""}`}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Valores de volta */}
              {formData.accepts_trade && (
                <div className="p-4 border rounded-lg space-y-4">
                  <Label className="text-base font-semibold">Valores de Volta em Dinheiro</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Valor mínimo de volta (R$)</Label>
                      <Input 
                        type="number" 
                        value={formData.min_cash_return} 
                        onChange={e => setFormData(p => ({ ...p, min_cash_return: e.target.value }))} 
                        placeholder="Ex: 5000"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Mínimo que aceita de volta</p>
                    </div>
                    <div>
                      <Label>Valor máximo de volta (R$)</Label>
                      <Input 
                        type="number" 
                        value={formData.max_cash_return} 
                        onChange={e => setFormData(p => ({ ...p, max_cash_return: e.target.value }))} 
                        placeholder="Ex: 20000"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Máximo que aceita de volta</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Restrições de troca */}
              {formData.accepts_trade && (
                <div className="p-4 border rounded-lg space-y-4">
                  <div>
                    <Label className="text-base font-semibold">O que você NÃO aceita?</Label>
                    <p className="text-sm text-muted-foreground">Adicione restrições para filtrar propostas indesejadas</p>
                  </div>
                  <TradeRestrictionsInput
                    value={formData.trade_restrictions}
                    onChange={(v) => setFormData(p => ({ ...p, trade_restrictions: v }))}
                  />
                </div>
              )}

              {/* Descrição da troca ideal */}
              <div>
                <Label className="text-base font-semibold">Descreva a troca ideal</Label>
                <p className="text-sm text-muted-foreground mb-2">Explique o que você está buscando</p>
                <Textarea 
                  value={formData.ideal_trade_description} 
                  onChange={e => setFormData(p => ({ ...p, ideal_trade_description: e.target.value }))} 
                  placeholder="Ex: Aceito moto até R$ 15.000 e o restante em dinheiro, ou carro popular do mesmo valor. Tenho interesse em SUVs de menor valor..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Etapa 6 - Fotos (CARROS E MOTOS) */}
          {step === 6 && formData.vehicle_type !== "caminhao" && formData.vehicle_type !== "van" && formData.vehicle_type !== "onibus" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Galeria de Fotos</h2>
                <p className="text-muted-foreground mt-1">Adicione fotos de todos os ângulos do veículo</p>
              </div>

              {formData.vehicle_type === "moto" ? (
                <MotoPhotoUploadGrid
                  images={images}
                  previews={imagePreviews}
                  onUpload={handleImageUpload}
                  onRemove={handleRemoveImage}
                />
              ) : (
                <PhotoUploadGrid
                  images={images}
                  previews={imagePreviews}
                  onUpload={handleImageUpload}
                  onRemove={handleRemoveImage}
                />
              )}

              {/* Descrição adicional */}
              <div>
                <Label className="text-base font-semibold">Descrição do Anúncio</Label>
                <p className="text-sm text-muted-foreground mb-2">Adicione informações extras que julgar importantes</p>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
                  placeholder={formData.vehicle_type === "moto" 
                    ? "Ex: Moto bem cuidada, sempre revisada, nunca caiu..."
                    : "Ex: Carro de família, sempre revisado em concessionária, nunca bateu..."}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            {step < steps.length ? (
              <Button type="button" onClick={handleNext} className="gap-2">
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleSubmit} 
                disabled={submitting}
                className="gap-2 bg-secondary hover:bg-secondary/90"
              >
                {submitting ? "Publicando..." : "Publicar Anúncio"}
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddProduct;
