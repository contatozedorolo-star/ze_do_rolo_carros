import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProposalDialog from "@/components/ProposalDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
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
  Settings
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
  rating_motor: number | null;
  rating_lataria: number | null;
  rating_pneus: number | null;
  rating_interior: number | null;
  rating_documentacao: number | null;
  diagnostic_notes: string | null;
  has_ze_seal: boolean;
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
  const { id } = useParams<{ id: string }>();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [images, setImages] = useState<VehicleImage[]>([]);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;

      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (vehicleError || !vehicleData) {
        setLoading(false);
        return;
      }

      setVehicle(vehicleData);

      const { data: imagesData } = await supabase
        .from("vehicle_images")
        .select("*")
        .eq("vehicle_id", id);

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

      setLoading(false);
    };

    fetchVehicle();
  }, [id]);

  const renderRatings = () => {
    if (!vehicle) return null;

    const ratings = [
      { label: "Motor", value: vehicle.rating_motor },
      { label: "Lataria", value: vehicle.rating_lataria },
      { label: "Pneus", value: vehicle.rating_pneus },
      { label: "Interior", value: vehicle.rating_interior },
      { label: "Documentação", value: vehicle.rating_documentacao },
    ].filter(r => r.value);

    if (ratings.length === 0) return null;

    const avgRating = ratings.reduce((acc, r) => acc + (r.value || 0), 0) / ratings.length;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-3xl font-bold text-primary">{avgRating.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">/5</div>
          <Star className="h-6 w-6 text-secondary fill-secondary" />
        </div>
        
        <div className="space-y-3">
          {ratings.map((rating) => (
            <div key={rating.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{rating.label}</span>
                <span className="font-medium text-foreground">{rating.value}/5</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((rating.value || 0) / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Veículo não encontrado</h1>
          <Button asChild>
            <Link to="/veiculos">Ver Veículos</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImage].image_url}
                    alt={vehicle.title}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Car className="h-16 w-16" />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {vehicle.has_ze_seal && (
                <Badge variant="outline" className="border-accent text-accent">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Selo Zé do Rolo
                </Badge>
              )}
              {vehicle.accepts_trade && (
                <Badge variant="outline" className="border-secondary text-secondary">
                  <ArrowLeftRight className="h-3 w-3 mr-1" />
                  Aceita Troca
                </Badge>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground">{vehicle.title}</h1>
              <p className="text-muted-foreground">{vehicle.brand} {vehicle.model} {vehicle.version}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-primary">
                  R$ {vehicle.price.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{vehicle.year_manufacture}/{vehicle.year_model}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{vehicle.km.toLocaleString()} km</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{vehicle.transmission}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{vehicle.fuel}</span>
              </div>
            </div>

            {/* Location & Seller */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {(vehicle.city || vehicle.state) && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {vehicle.city}{vehicle.city && vehicle.state ? ", " : ""}{vehicle.state}
                </div>
              )}
              {seller && (
                <span>Vendedor: {seller.full_name}</span>
              )}
            </div>

            {vehicle.description && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
                <p className="text-muted-foreground">{vehicle.description}</p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <ProposalDialog
                vehicleId={vehicle.id}
                vehicleTitle={vehicle.title}
                vehiclePrice={vehicle.price}
                sellerId={vehicle.user_id}
                acceptsTrade={vehicle.accepts_trade}
                trigger={
                  <Button variant="cta" size="lg" className="flex-1">
                    Fazer Proposta
                  </Button>
                }
              />
              <Button variant="outline" size="lg">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Diagnosis Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Diagnóstico Zé do Rolo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              {renderRatings()}
              {vehicle.diagnostic_notes && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{vehicle.diagnostic_notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
