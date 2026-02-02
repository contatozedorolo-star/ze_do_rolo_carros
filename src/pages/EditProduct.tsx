import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Car, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VehicleData {
  id: string;
  title: string;
  brand: string;
  model: string;
  version: string | null;
  year_manufacture: number;
  year_model: number;
  km: number;
  price: number;
  color: string;
  description: string | null;
  is_active: boolean;
  city: string | null;
  state: string | null;
  user_id: string;
  vehicle_images?: { image_url: string; is_primary: boolean }[];
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [version, setVersion] = useState("");
  const [yearManufacture, setYearManufacture] = useState("");
  const [yearModel, setYearModel] = useState("");
  const [km, setKm] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user && id) {
      fetchVehicle();
    }
  }, [user, authLoading, id]);

  const fetchVehicle = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*, vehicle_images(image_url, is_primary)")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error("Veículo não encontrado");
        navigate("/profile");
        return;
      }

      // Check ownership
      if (data.user_id !== user?.id) {
        toast.error("Você não tem permissão para editar este veículo");
        navigate("/profile");
        return;
      }

      setVehicle(data);
      setTitle(data.title);
      setBrand(data.brand);
      setModel(data.model);
      setVersion(data.version || "");
      setYearManufacture(data.year_manufacture.toString());
      setYearModel(data.year_model.toString());
      setKm(data.km.toString());
      setPrice(data.price.toString());
      setColor(data.color);
      setDescription(data.description || "");
      setIsActive(data.is_active);
      setCity(data.city || "");
      setState(data.state || "");
    } catch (error: any) {
      console.error("Error fetching vehicle:", error);
      toast.error("Erro ao carregar veículo");
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!vehicle) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({
          title,
          brand,
          model,
          version: version || null,
          year_manufacture: parseInt(yearManufacture),
          year_model: parseInt(yearModel),
          km: parseInt(km),
          price: parseFloat(price),
          color,
          description: description || null,
          is_active: isActive,
          city: city || null,
          state: state || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", vehicle.id);

      if (error) throw error;

      toast.success("Veículo atualizado com sucesso!");
      navigate("/profile?tab=veiculos");
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      toast.error("Erro ao atualizar veículo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicle) return;

    setDeleting(true);
    try {
      // Delete vehicle images first
      const { error: imagesError } = await supabase
        .from("vehicle_images")
        .delete()
        .eq("vehicle_id", vehicle.id);

      if (imagesError) throw imagesError;

      // Delete vehicle
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicle.id);

      if (error) throw error;

      toast.success("Veículo excluído com sucesso!");
      navigate("/profile?tab=veiculos");
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      toast.error("Erro ao excluir veículo");
    } finally {
      setDeleting(false);
    }
  };

  const primaryImage = vehicle?.vehicle_images?.find(img => img.is_primary)?.image_url
    || vehicle?.vehicle_images?.[0]?.image_url;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/profile?tab=veiculos")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Editar Anúncio</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vehicle Preview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Prévia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/10] rounded-lg overflow-hidden bg-muted mb-4">
                {primaryImage ? (
                  <img 
                    src={primaryImage} 
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-foreground">{title || "Título do veículo"}</h3>
              <p className="text-sm text-muted-foreground">{brand} {model}</p>
              <p className="text-lg font-bold text-primary mt-2">
                R$ {price ? parseFloat(price).toLocaleString("pt-BR") : "0"}
              </p>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Informações do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Título do Anúncio</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Honda Civic 2020 EXL"
                />
              </div>

              {/* Brand & Model */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ex: Honda"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Ex: Civic"
                  />
                </div>
              </div>

              {/* Version */}
              <div className="space-y-2">
                <Label htmlFor="version">Versão (opcional)</Label>
                <Input
                  id="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="Ex: EXL 2.0"
                />
              </div>

              {/* Years */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearManufacture">Ano de Fabricação</Label>
                  <Input
                    id="yearManufacture"
                    type="number"
                    value={yearManufacture}
                    onChange={(e) => setYearManufacture(e.target.value)}
                    placeholder="Ex: 2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearModel">Ano do Modelo</Label>
                  <Input
                    id="yearModel"
                    type="number"
                    value={yearModel}
                    onChange={(e) => setYearModel(e.target.value)}
                    placeholder="Ex: 2021"
                  />
                </div>
              </div>

              {/* KM & Price */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="km">Quilometragem</Label>
                  <Input
                    id="km"
                    type="number"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    placeholder="Ex: 45000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ex: 95000"
                  />
                </div>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Ex: Preto"
                />
              </div>

              {/* Location */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Ex: SP"
                    maxLength={2}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva seu veículo..."
                  rows={4}
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label htmlFor="active">Anúncio Ativo</Label>
                  <p className="text-sm text-muted-foreground">
                    Quando ativo, seu anúncio aparece nas buscas
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar Alterações
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={deleting}>
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Excluir Anúncio
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir anúncio?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O anúncio e todas as suas imagens serão excluídos permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProduct;
