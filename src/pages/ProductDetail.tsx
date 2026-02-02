import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProposalDialog from "@/components/ProposalDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { vehicles as mockVehicles } from "@/data/mockProducts";
import { extractIdFromSlug } from "@/lib/slugify";
import { formatCurrencyShort } from "@/lib/formatters";
import { useTrackVehicleView, useVehicleViewCount } from "@/hooks/useVehicleViews";
import { 
  MapPin, 
  CheckCircle, 
  Shield, 
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  MessageCircle,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  FileText,
  Eye,
  Zap,
  Disc,
  Sofa,
  Wrench,
  CircleDot,
  TrendingUp,
  Package
} from "lucide-react";

interface Vehicle {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  brand: string;
  model: string;
  version: string | null;
  year_manufacture: number;
  year_model: number;
  km: number;
  color: string;
  transmission: string;
  fuel: string;
  price: number;
  accepts_trade: boolean;
  city: string | null;
  state: string | null;
  plate_end: string | null;
  rating_motor: number | null;
  rating_lataria: number | null;
  rating_pneus: number | null;
  rating_interior: number | null;
  rating_documentacao: number | null;
  rating_cambio: number | null;
  rating_freios: number | null;
  rating_suspensao: number | null;
  rating_estetica: number | null;
  rating_mecanica_geral: number | null;
  rating_eletrica: number | null;
  diagnostic_notes: string | null;
  has_ze_seal: boolean;
  trade_description: string | null;
  trade_value_accepted: number | null;
  min_cash_return: number | null;
  ideal_trade_description: string | null;
  engine: string | null;
  doors: number | null;
  body_type: string | null;
  optionals: string[] | null;
  created_at: string;
}

interface VehicleImage {
  id: string;
  image_url: string;
  image_type: string;
}

interface SellerProfile {
  id: string;
  full_name: string | null;
}

const ProductDetail = () => {
  const { id: rawId, slug } = useParams<{ id?: string; slug?: string }>();
  
  // Extract ID from slug if using slug route, otherwise use direct ID
  const id = slug ? extractIdFromSlug(slug) : rawId;
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [images, setImages] = useState<VehicleImage[]>([]);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [sellerKYCApproved, setSellerKYCApproved] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Track vehicle view
  useTrackVehicleView(vehicle?.id);
  
  // Get view count
  const { data: viewCount } = useVehicleViewCount(vehicle?.id);

  // FIPE data
  const [fipeData, setFipeData] = useState<{
    price: string;
    priceNumber: number;
    fipeCode?: string;
    referenceMonth?: string;
    note?: string;
  } | null>(null);
  const [fipeLoading, setFipeLoading] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;

      // Check if id is a valid UUID (36 chars with dashes)
      const isFullUUID = id.length === 36 && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      if (!isFullUUID) {
        // ID is not valid, try to find in mock data
        const mock = mockVehicles.find((v) => v.id === id);
        if (mock) {
          // Handle mock data (existing code below will handle this)
        } else {
          setLoading(false);
          return;
        }
      }

      // Fetch vehicle from Supabase using full UUID
      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      // Fallback: veículos fictícios (mock) para visual da Home
      if (vehicleError || !vehicleData) {
        const mock = mockVehicles.find((v) => v.id === id);

        if (mock) {
          const [cityRaw, stateRaw] = (mock.location || "").split(",").map((s) => s.trim());
          const [yearManufactureRaw, yearModelRaw] = (mock.year || "").split("/").map((s) => s.trim());
          const yearManufacture = Number(yearManufactureRaw) || new Date().getFullYear();
          const yearModel = Number(yearModelRaw) || yearManufacture;

          const titleParts = (mock.title || "").split(" ");
          const brand = titleParts[0] || "Veículo";
          const model = titleParts.slice(1, 3).join(" ") || "";

          const baseScore10 = Math.min(10, Math.max(0, (mock.motorScore || 4) * 2));

          const mockVehicle: Vehicle = {
            id: mock.id,
            // uuid "válido" para não quebrar fluxos que esperam uuid
            user_id: "00000000-0000-0000-0000-000000000000",
            title: mock.title,
            description: "Veículo fictício para demonstração do layout da página de vendas.",
            brand,
            model,
            version: null,
            year_manufacture: yearManufacture,
            year_model: yearModel,
            km: mock.mileage || 0,
            color: "preto",
            transmission: mock.transmission,
            fuel: mock.fuel,
            price: mock.price,
            accepts_trade: !!mock.acceptsTrade,
            city: cityRaw || null,
            state: stateRaw || null,
            plate_end: null,
            rating_motor: baseScore10,
            rating_cambio: baseScore10,
            rating_lataria: mock.paintOriginal ? 9 : 7,
            rating_estetica: mock.paintOriginal ? 9 : 7,
            rating_pneus: 8,
            rating_interior: 8,
            rating_documentacao: 9,
            rating_freios: 8,
            rating_suspensao: 8,
            rating_mecanica_geral: baseScore10,
            rating_eletrica: 8,
            diagnostic_notes: "O Zé do Rolo realiza a conferência desses itens no ato da vistoria cautelar.",
            has_ze_seal: !!mock.verified,
            trade_description: null,
            trade_value_accepted: null,
            min_cash_return: null,
            ideal_trade_description: mock.acceptsTrade
              ? "Aceita troca + volta em dinheiro (simulação)."
              : null,
            engine: null,
            doors: null,
            body_type: null,
            optionals: null,
            created_at: new Date().toISOString(),
          };

          setVehicle(mockVehicle);
          setImages([
            {
              id: `${mock.id}-image-1`,
              image_url: mock.image,
              image_type: "primary",
            },
          ]);
          setSeller({ id: mockVehicle.user_id, full_name: "Vendedor (Demonstração)" });
          setLoading(false);
          return;
        }

        setLoading(false);
        return;
      }

      setVehicle(vehicleData);

      // Use the full vehicle ID from the fetched data for related queries
      const { data: imagesData } = await supabase
        .from("vehicle_images")
        .select("*")
        .eq("vehicle_id", vehicleData.id);

      if (imagesData) {
        setImages(imagesData);
      }

      const { data: sellerData } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", vehicleData.user_id)
        .single();

      if (sellerData) {
        setSeller(sellerData);
      }

      // Check if seller has approved KYC
      const { data: kycData } = await supabase
        .from("kyc_verifications")
        .select("status")
        .eq("user_id", vehicleData.user_id)
        .eq("status", "approved")
        .maybeSingle();

      setSellerKYCApproved(!!kycData);

      setLoading(false);
    };

    fetchVehicle();
  }, [id]);

  // Fetch FIPE price when vehicle is loaded
  useEffect(() => {
    const fetchFipePrice = async () => {
      if (!vehicle) return;

      setFipeLoading(true);
      try {
        // Determine vehicle type for FIPE API
        let vehicleType: "carros" | "motos" | "caminhoes" = "carros";
        const titleLower = vehicle.title.toLowerCase();
        const brandLower = vehicle.brand.toLowerCase();

        if (
          titleLower.includes("moto") ||
          titleLower.includes("cb ") ||
          titleLower.includes("cg ") ||
          titleLower.includes("hornet") ||
          titleLower.includes("ninja") ||
          brandLower.includes("honda") && (titleLower.includes("cb") || titleLower.includes("cg"))
        ) {
          vehicleType = "motos";
        } else if (
          titleLower.includes("scania") ||
          titleLower.includes("volvo fh") ||
          titleLower.includes("mercedes-benz actros") ||
          titleLower.includes("caminhão") ||
          titleLower.includes("cavalo")
        ) {
          vehicleType = "caminhoes";
        }

        const response = await supabase.functions.invoke("fipe-lookup", {
          body: {
            vehicleType,
            brand: vehicle.brand,
            model: vehicle.model || vehicle.title.split(" ").slice(1, 3).join(" "),
            year: vehicle.year_model,
          },
        });

        if (response.data?.success && response.data?.data?.priceNumber) {
          setFipeData(response.data.data);
        } else {
          console.log("FIPE lookup failed or no price:", response.data);
          // Fallback: estimate based on vehicle price
          setFipeData({
            price: formatCurrencyShort(Math.round(vehicle.price * 1.05)),
            priceNumber: Math.round(vehicle.price * 1.05),
            note: "Estimativa baseada no mercado (FIPE indisponível para este modelo)",
          });
        }
      } catch (error) {
        console.error("Error fetching FIPE:", error);
        // Fallback
        setFipeData({
          price: formatCurrencyShort(Math.round(vehicle.price * 1.05)),
          priceNumber: Math.round(vehicle.price * 1.05),
          note: "Estimativa baseada no mercado",
        });
      } finally {
        setFipeLoading(false);
      }
    };

    fetchFipePrice();
  }, [vehicle]);

  // Fallback FIPE price for display
  const fipePrice = fipeData?.priceNumber || (vehicle ? Math.round(vehicle.price * 1.05) : 0);

  const getRatingItems = () => {
    if (!vehicle) return [];

    return [
      { label: "Motor", value: vehicle.rating_motor, icon: Zap },
      { label: "Câmbio", value: vehicle.rating_cambio, icon: Settings },
      { label: "Lataria", value: vehicle.rating_lataria, icon: Car },
      { label: "Estética", value: vehicle.rating_estetica, icon: Eye },
      { label: "Pneus", value: vehicle.rating_pneus, icon: CircleDot },
      { label: "Interior", value: vehicle.rating_interior, icon: Sofa },
      { label: "Freios", value: vehicle.rating_freios, icon: Disc },
      { label: "Suspensão", value: vehicle.rating_suspensao, icon: Wrench },
      { label: "Elétrica", value: vehicle.rating_eletrica, icon: Zap },
      { label: "Mecânica Geral", value: vehicle.rating_mecanica_geral, icon: Wrench },
      { label: "Documentação", value: vehicle.rating_documentacao, icon: FileText },
    ].filter(r => r.value !== null && r.value !== undefined);
  };

  const getAverageRating = () => {
    const ratings = getRatingItems();
    if (ratings.length === 0) return 0;
    return ratings.reduce((acc, r) => acc + (r.value || 0), 0) / ratings.length;
  };

  const getSpecifications = () => {
    if (!vehicle) return [];

    return [
      { label: "Ano", value: `${vehicle.year_manufacture}/${vehicle.year_model}`, icon: Calendar },
      { label: "Quilometragem", value: `${vehicle.km.toLocaleString()} km`, icon: Gauge },
      { label: "Câmbio", value: vehicle.transmission, icon: Settings },
      { label: "Combustível", value: vehicle.fuel, icon: Fuel },
      { label: "Cor", value: vehicle.color, icon: Palette },
      { label: "Final da Placa", value: vehicle.plate_end || "N/I", icon: FileText },
      { label: "Motor", value: vehicle.engine || "N/I", icon: Zap },
      { label: "Portas", value: vehicle.doors ? `${vehicle.doors} portas` : "N/I", icon: Car },
      { label: "Carroceria", value: vehicle.body_type || "N/I", icon: Package },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#142562] border-t-transparent"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <Car className="h-20 w-20 mx-auto text-slate-300 mb-6" />
          <h1 className="text-2xl font-bold text-[#142562] mb-4">Veículo não encontrado</h1>
          <p className="text-slate-500 mb-6">O veículo que você está procurando não existe ou foi removido.</p>
          <Button asChild className="bg-[#FF8C36] hover:bg-[#e67d2e] text-white">
            <Link to="/veiculos">Ver Veículos Disponíveis</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const ratings = getRatingItems();
  const avgRating = getAverageRating();
  const specifications = getSpecifications();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container py-3">
            <nav className="text-sm text-slate-500">
              <Link to="/" className="hover:text-[#142562]">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/veiculos" className="hover:text-[#142562]">Veículos</Link>
              <span className="mx-2">/</span>
              <span className="text-[#142562] font-medium">{vehicle.brand} {vehicle.model}</span>
            </nav>
          </div>
        </div>

        <div className="container py-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Gallery & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="relative aspect-[16/10]">
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[currentImage].image_url}
                        alt={vehicle.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Verified Badge Overlay */}
                      {vehicle.has_ze_seal && (
                        <div className="absolute top-4 left-4 bg-[#29B765] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                          <Shield className="h-5 w-5" />
                          <span className="font-semibold text-sm">Verificado pelo Zé</span>
                        </div>
                      )}

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImage + 1} / {images.length}
                      </div>
                      
                      {/* Navigation Arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white shadow-lg transition-all hover:scale-105"
                          >
                            <ChevronLeft className="h-6 w-6 text-[#142562]" />
                          </button>
                          <button
                            onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white shadow-lg transition-all hover:scale-105"
                          >
                            <ChevronRight className="h-6 w-6 text-[#142562]" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <Car className="h-24 w-24 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((img, index) => (
                        <button
                          key={img.id}
                          onClick={() => setCurrentImage(index)}
                          className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImage === index 
                              ? "border-[#FF8C36] shadow-md" 
                              : "border-transparent hover:border-slate-300"
                          }`}
                        >
                          <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Specifications Grid */}
              <Card className="bg-white shadow-sm border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[#142562] mb-6 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Especificações Técnicas
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {specifications.map((spec) => (
                      <div 
                        key={spec.label}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div className="p-2 bg-[#142562]/10 rounded-lg">
                          <spec.icon className="h-5 w-5 text-[#142562]" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">{spec.label}</p>
                          <p className="font-semibold text-[#142562] capitalize">{spec.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Seller Description */}
              {vehicle.description && (
                <Card className="bg-white shadow-sm border-0">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-[#142562] mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Descrição do Vendedor
                    </h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {vehicle.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Optionals */}
              {vehicle.optionals && vehicle.optionals.length > 0 && (
                <Card className="bg-white shadow-sm border-0">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-[#142562] mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Opcionais
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.optionals.map((opt, index) => (
                        <Badge 
                          key={index}
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5"
                        >
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Diagnóstico de Confiança do Dono */}
              {ratings.length > 0 && (
                <Card className="bg-gradient-to-br from-[#142562] to-[#1e3a8a] text-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl">
                          <Shield className="h-7 w-7 text-[#29B765]" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">Diagnóstico de Confiança do Dono</h2>
                          <p className="text-white/70 text-sm">Avaliação detalhada do veículo</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-6 w-6 text-[#FF8C36] fill-[#FF8C36]" />
                          <span className="text-3xl font-bold">{avgRating.toFixed(1)}</span>
                          <span className="text-white/60">/10</span>
                        </div>
                        <p className="text-xs text-white/60">Nota Geral</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {ratings.map((rating) => (
                        <div key={rating.label} className="bg-white/10 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <rating.icon className="h-4 w-4 text-white/70" />
                              <span className="text-sm font-medium">{rating.label}</span>
                            </div>
                            <span className="font-bold text-[#FF8C36]">{rating.value}/10</span>
                          </div>
                          <Progress 
                            value={(rating.value || 0) * 10} 
                            className="h-2 bg-white/20"
                          />
                        </div>
                      ))}
                    </div>

                    {vehicle.diagnostic_notes && (
                      <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
                        <p className="text-sm text-white/90 italic">
                          "{vehicle.diagnostic_notes}"
                        </p>
                      </div>
                    )}

                    <div className="mt-6 p-4 bg-[#29B765]/20 rounded-xl border border-[#29B765]/30 flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#29B765] shrink-0 mt-0.5" />
                      <p className="text-sm text-white/90">
                        O Zé do Rolo realiza a conferência desses itens no ato da vistoria cautelar, 
                        garantindo transparência e segurança para sua compra.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trade Section */}
              {vehicle.accepts_trade && (
                <Card className="bg-gradient-to-r from-[#FF8C36] to-[#f97316] text-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <ArrowLeftRight className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">O que o Dono Aceita na Troca</h2>
                        <p className="text-white/80 text-sm">Faça uma proposta personalizada</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {vehicle.ideal_trade_description && (
                        <div className="p-4 bg-white/20 rounded-xl">
                          <p className="font-medium">{vehicle.ideal_trade_description}</p>
                        </div>
                      )}
                      
                      {vehicle.trade_value_accepted && (
                        <div className="flex items-center justify-between p-4 bg-white/20 rounded-xl">
                          <span>Valor aceito em troca:</span>
                          <span className="font-bold text-lg">
                            Até {formatCurrencyShort(vehicle.trade_value_accepted)}
                          </span>
                        </div>
                      )}
                      
                      {vehicle.min_cash_return && (
                        <div className="flex items-center justify-between p-4 bg-white/20 rounded-xl">
                          <span>Mínimo de volta em dinheiro:</span>
                          <span className="font-bold text-lg">
                            {formatCurrencyShort(vehicle.min_cash_return)}
                          </span>
                        </div>
                      )}

                      {!vehicle.ideal_trade_description && !vehicle.trade_value_accepted && (
                        <div className="p-4 bg-white/20 rounded-xl">
                          <p>Este vendedor está aberto a propostas de troca. Entre em contato para negociar!</p>
                        </div>
                      )}
                    </div>

                    <ProposalDialog
                      vehicleId={vehicle.id}
                      vehicleTitle={vehicle.title}
                      vehiclePrice={vehicle.price}
                      sellerId={vehicle.user_id}
                      acceptsTrade={true}
                      trigger={
                        <Button 
                          className="w-full bg-white text-[#FF8C36] hover:bg-white/90 font-bold py-6 text-lg shadow-lg"
                        >
                          <Package className="h-5 w-5 mr-2" />
                          Montar Meu Lote para Troca
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sticky Conversion Block */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Main Conversion Card */}
                <Card className="bg-white shadow-lg border-0 overflow-hidden">
                  <CardContent className="p-6">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vehicle.has_ze_seal && (
                        <Badge className="bg-[#29B765] text-white border-0">
                          <Shield className="h-3 w-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                      {vehicle.accepts_trade && (
                        <Badge className="bg-[#FF8C36] text-white border-0">
                          <ArrowLeftRight className="h-3 w-3 mr-1" />
                          Aceita Troca
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-[#142562] mb-1">
                      {vehicle.brand} {vehicle.model}
                    </h1>
                    <p className="text-slate-500 mb-4">
                      {vehicle.version || vehicle.title}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-[#142562]">
                        {formatCurrencyShort(vehicle.price)}
                      </span>
                    </div>

                    {/* View Counter */}
                    {viewCount !== undefined && viewCount > 0 && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <Eye className="h-4 w-4" />
                        <span>{viewCount} visualiza{viewCount === 1 ? 'ção' : 'ções'}</span>
                      </div>
                    )}

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-slate-50 rounded-xl">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase">Ano</p>
                        <p className="font-bold text-[#142562]">{vehicle.year_manufacture}/{vehicle.year_model}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase">KM</p>
                        <p className="font-bold text-[#142562]">{vehicle.km.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase">Cor</p>
                        <p className="font-bold text-[#142562] capitalize">{vehicle.color}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase">Final Placa</p>
                        <p className="font-bold text-[#142562]">{vehicle.plate_end || "-"}</p>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <ProposalDialog
                        vehicleId={vehicle.id}
                        vehicleTitle={vehicle.title}
                        vehiclePrice={vehicle.price}
                        sellerId={vehicle.user_id}
                        acceptsTrade={vehicle.accepts_trade}
                        trigger={
                          <Button 
                            className="w-full bg-[#FF8C36] hover:bg-[#e67d2e] text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                          >
                            <ArrowLeftRight className="h-5 w-5 mr-2" />
                            FAZER PROPOSTA DE TROCA
                          </Button>
                        }
                      />
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-[#142562] text-[#142562] hover:bg-[#142562] hover:text-white font-bold py-6 text-lg transition-all"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        FALAR COM CONSULTOR ZÉ
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* FIPE Comparison */}
                <Card className="bg-white shadow-sm border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-[#142562]" />
                      <h3 className="font-semibold text-[#142562]">Comparativo FIPE</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-[#29B765]/10 rounded-lg">
                        <span className="text-sm text-slate-600">Preço Zé do Rolo</span>
                        <span className="font-bold text-[#29B765]">
                          {formatCurrencyShort(vehicle.price)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600">Preço Médio FIPE</span>
                          {fipeData?.referenceMonth && (
                            <span className="text-xs text-slate-400">{fipeData.referenceMonth}</span>
                          )}
                        </div>
                        {fipeLoading ? (
                          <div className="animate-pulse bg-slate-200 h-5 w-24 rounded" />
                        ) : (
                          <span className="font-bold text-slate-500">
                            {fipeData?.price || `R$ ${fipePrice.toLocaleString("pt-BR")}`}
                          </span>
                        )}
                      </div>
                      {fipeData?.fipeCode && (
                        <p className="text-xs text-slate-400 text-center">
                          Código FIPE: {fipeData.fipeCode}
                        </p>
                      )}
                      {fipeData?.note && (
                        <p className="text-xs text-slate-400 text-center italic">
                          {fipeData.note}
                        </p>
                      )}
                      {vehicle.price < fipePrice && !fipeLoading && (
                        <p className="text-xs text-[#29B765] text-center mt-2 font-medium">
                          ✓ Este veículo está abaixo da tabela FIPE!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Seller Info */}
                <Card className="bg-white shadow-sm border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-[#142562] rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {seller?.full_name?.charAt(0) || "V"}
                        </div>
                        {sellerKYCApproved && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#29B765] rounded-full flex items-center justify-center border-2 border-white">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#142562]">
                            {seller?.full_name || "Vendedor"}
                          </p>
                          {sellerKYCApproved && (
                            <Badge className="bg-[#29B765]/10 text-[#29B765] border-0 text-xs px-2 py-0.5">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verificado
                            </Badge>
                          )}
                        </div>
                        {(vehicle.city || vehicle.state) && (
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {vehicle.city}{vehicle.city && vehicle.state ? ", " : ""}{vehicle.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
