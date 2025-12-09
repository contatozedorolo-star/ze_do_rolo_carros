import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  CheckCircle, 
  Shield, 
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  MessageCircle,
  AlertTriangle
} from "lucide-react";

interface Product {
  id: string;
  user_id: string;
  category: string;
  title: string;
  description: string | null;
  price_estimate: number;
  is_for_sale: boolean;
  accepts_trade: boolean;
  urgency_level: string;
  rating_motor: number | null;
  rating_exterior: number | null;
  rating_function: number | null;
  rating_interior: number | null;
  rating_documents: number | null;
  declared_defects: string | null;
  location: string | null;
  is_certified: boolean;
  created_at: string;
}

interface ProductImage {
  id: string;
  image_url: string;
  image_type: string;
}

interface SellerProfile {
  id: string;
  name: string;
  user_level: string;
  is_verified: boolean;
}

const levelColors: Record<string, string> = {
  bronze: "bg-amber-600",
  prata: "bg-gray-400",
  ouro: "bg-yellow-500",
  diamante: "bg-cyan-400",
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalData, setProposalData] = useState({
    cashAmount: "",
    message: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (productError || !productData) {
        setLoading(false);
        return;
      }

      setProduct(productData);

      // Fetch images
      const { data: imagesData } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("display_order");

      if (imagesData) {
        setImages(imagesData);
      }

      // Fetch seller profile
      const { data: sellerData } = await supabase
        .from("profiles")
        .select("id, name, user_level, is_verified")
        .eq("id", productData.user_id)
        .single();

      if (sellerData) {
        setSeller(sellerData as SellerProfile);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleProposal = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para enviar uma proposta",
        variant: "destructive",
      });
      return;
    }

    // For now, just show a success message
    toast({
      title: "Proposta enviada!",
      description: "O vendedor receberá sua proposta em breve.",
    });
    setProposalOpen(false);
  };

  const renderRadarChart = () => {
    const ratings = [
      { label: "Exterior", value: product?.rating_exterior || 0 },
      { label: "Funcionamento", value: product?.rating_function || 0 },
    ];

    if (product?.category === "veiculos") {
      ratings.unshift({ label: "Motor", value: product?.rating_motor || 0 });
      ratings.push(
        { label: "Interior", value: product?.rating_interior || 0 },
        { label: "Documentos", value: product?.rating_documents || 0 }
      );
    }

    const avgRating = ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length;

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
                  style={{ width: `${(rating.value / 5) * 100}%` }}
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

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produto não encontrado</h1>
          <Button asChild>
            <Link to="/">Voltar para Home</Link>
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
                    alt={product.title}
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
                  Sem imagem
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

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.is_certified && (
                <Badge variant="outline" className="border-accent text-accent">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Zé do Rolo Certificado
                </Badge>
              )}
              {product.accepts_trade && (
                <Badge variant="outline" className="border-secondary text-secondary">
                  <ArrowLeftRight className="h-3 w-3 mr-1" />
                  Aceita Troca
                </Badge>
              )}
              {seller?.is_verified && (
                <Badge variant="outline" className="border-accent text-accent">
                  <Shield className="h-3 w-3 mr-1" />
                  Vendedor Verificado
                </Badge>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <span className="text-sm text-muted-foreground capitalize">{product.category}</span>
              <h1 className="text-2xl font-bold text-foreground mt-1">{product.title}</h1>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-primary">
                  R$ {product.price_estimate.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>

            {/* Location & Seller */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {product.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {product.location}
                </div>
              )}
              {seller && (
                <div className="flex items-center gap-2">
                  <Badge className={`${levelColors[seller.user_level]} text-primary-foreground text-xs`}>
                    {seller.user_level}
                  </Badge>
                  <span>{seller.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Defects Warning */}
            {product.declared_defects && (
              <div className="p-4 border border-secondary/30 bg-secondary/5 rounded-lg">
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">Observações do Vendedor</span>
                </div>
                <p className="text-muted-foreground text-sm">{product.declared_defects}</p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Dialog open={proposalOpen} onOpenChange={setProposalOpen}>
                <DialogTrigger asChild>
                  <Button variant="cta" size="lg" className="flex-1">
                    Fazer Proposta Agora
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fazer Proposta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Produto:</p>
                      <p className="font-semibold text-foreground">{product.title}</p>
                      <p className="text-lg font-bold text-primary">
                        R$ {product.price_estimate.toLocaleString("pt-BR")}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cashAmount">Quanto em dinheiro? (R$)</Label>
                      <Input
                        id="cashAmount"
                        type="number"
                        placeholder="0,00"
                        value={proposalData.cashAmount}
                        onChange={(e) => setProposalData(prev => ({ ...prev, cashAmount: e.target.value }))}
                      />
                    </div>

                    {product.accepts_trade && (
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Deseja incluir itens do seu lote na proposta?
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/profile">Ver Meu Lote</Link>
                        </Button>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem (opcional)</Label>
                      <Input
                        id="message"
                        placeholder="Escreva algo para o vendedor..."
                        value={proposalData.message}
                        onChange={(e) => setProposalData(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>

                    <Button variant="cta" className="w-full" onClick={handleProposal}>
                      Enviar Proposta
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

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
              {renderRadarChart()}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
