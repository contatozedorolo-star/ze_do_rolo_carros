import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileCheck, Clock, CheckCircle, XCircle, Camera, CreditCard, Loader2 } from "lucide-react";

interface VerificationRequest {
  id: string;
  document_type: string;
  document_front_url: string | null;
  document_back_url: string | null;
  selfie_url: string | null;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  submitted_at: string | null;
  reviewer_notes: string | null;
}

const documentTypes = [
  { value: "rg", label: "RG (Registro Geral)" },
  { value: "cnh", label: "CNH (Carteira de Motorista)" },
  { value: "passport", label: "Passaporte" },
];

const statusInfo = {
  pending: {
    icon: Clock,
    label: "Pendente",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  submitted: {
    icon: Clock,
    label: "Em Análise",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  approved: {
    icon: CheckCircle,
    label: "Aprovado",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  rejected: {
    icon: XCircle,
    label: "Rejeitado",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

const KYCVerificationForm = () => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  useEffect(() => {
    fetchVerificationRequest();
  }, [user]);

  const fetchVerificationRequest = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setVerificationRequest(data as VerificationRequest);
      setDocumentType(data.document_type);
    }
    setLoading(false);
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from("kyc-documents")
      .upload(path, file, { upsert: true });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    return data.path;
  };

  const handleSubmit = async () => {
    if (!user || !documentType || !documentFront || !selfie) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione o tipo de documento e faça upload dos arquivos necessários.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const timestamp = Date.now();
      
      // Upload files
      const frontPath = await uploadFile(documentFront, `${user.id}/doc_front_${timestamp}.${documentFront.name.split('.').pop()}`);
      const backPath = documentBack ? await uploadFile(documentBack, `${user.id}/doc_back_${timestamp}.${documentBack.name.split('.').pop()}`) : null;
      const selfiePath = await uploadFile(selfie, `${user.id}/selfie_${timestamp}.${selfie.name.split('.').pop()}`);

      if (!frontPath || !selfiePath) {
        throw new Error("Erro ao fazer upload dos arquivos");
      }

      // Create or update verification request
      if (verificationRequest && verificationRequest.status === 'pending') {
        const { error } = await supabase
          .from("verification_requests")
          .update({
            document_type: documentType,
            document_front_url: frontPath,
            document_back_url: backPath,
            selfie_url: selfiePath,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
          })
          .eq("id", verificationRequest.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("verification_requests")
          .insert({
            user_id: user.id,
            document_type: documentType,
            document_front_url: frontPath,
            document_back_url: backPath,
            selfie_url: selfiePath,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      toast({
        title: "Documentos enviados!",
        description: "Sua solicitação de verificação foi enviada e será analisada em breve.",
      });

      // Refresh data
      await fetchVerificationRequest();
      refreshProfile();
      
      // Clear form
      setDocumentFront(null);
      setDocumentBack(null);
      setSelfie(null);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.message || "Ocorreu um erro ao enviar seus documentos.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show status card if request exists and is not pending
  if (verificationRequest && verificationRequest.status !== 'pending') {
    const status = statusInfo[verificationRequest.status];
    const StatusIcon = status.icon;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${status.color}`} />
            Verificação de Identidade
          </CardTitle>
          <CardDescription>
            Status da sua solicitação de verificação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg ${status.bgColor}`}>
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-8 w-8 ${status.color}`} />
              <div>
                <p className={`font-semibold ${status.color}`}>{status.label}</p>
                <p className="text-sm text-muted-foreground">
                  {verificationRequest.status === 'submitted' && "Seus documentos estão sendo analisados. Isso pode levar até 24 horas."}
                  {verificationRequest.status === 'approved' && "Sua identidade foi verificada com sucesso!"}
                  {verificationRequest.status === 'rejected' && "Sua verificação foi rejeitada. Veja os motivos abaixo."}
                </p>
              </div>
            </div>
          </div>

          {verificationRequest.status === 'rejected' && verificationRequest.reviewer_notes && (
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <p className="text-sm font-medium text-destructive mb-1">Motivo da rejeição:</p>
              <p className="text-sm text-muted-foreground">{verificationRequest.reviewer_notes}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setVerificationRequest(null)}
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>Documento: {documentTypes.find(d => d.value === verificationRequest.document_type)?.label}</p>
            {verificationRequest.submitted_at && (
              <p>Enviado em: {new Date(verificationRequest.submitted_at).toLocaleDateString('pt-BR')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Verificação de Identidade (KYC)
        </CardTitle>
        <CardDescription>
          Complete a verificação para aumentar seu nível de confiança e desbloquear recursos exclusivos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Type Selection */}
        <div className="space-y-2">
          <Label>Tipo de Documento</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((doc) => (
                <SelectItem key={doc.value} value={doc.value}>
                  {doc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Document Front */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Frente do Documento *
          </Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="doc-front"
              onChange={(e) => setDocumentFront(e.target.files?.[0] || null)}
            />
            <label htmlFor="doc-front" className="cursor-pointer">
              {documentFront ? (
                <div className="flex items-center justify-center gap-2 text-accent">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{documentFront.name}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Clique para fazer upload da frente do documento</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Document Back (optional for some documents) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Verso do Documento (opcional)
          </Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="doc-back"
              onChange={(e) => setDocumentBack(e.target.files?.[0] || null)}
            />
            <label htmlFor="doc-back" className="cursor-pointer">
              {documentBack ? (
                <div className="flex items-center justify-center gap-2 text-accent">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{documentBack.name}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Clique para fazer upload do verso do documento</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Selfie */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Selfie com o Documento *
          </Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="selfie"
              onChange={(e) => setSelfie(e.target.files?.[0] || null)}
            />
            <label htmlFor="selfie" className="cursor-pointer">
              {selfie ? (
                <div className="flex items-center justify-center gap-2 text-accent">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{selfie.name}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Tire uma selfie segurando o documento ao lado do rosto</p>
                </div>
              )}
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            A foto deve mostrar claramente seu rosto e o documento na mesma imagem.
          </p>
        </div>

        {/* Submit Button */}
        <Button 
          variant="cta" 
          className="w-full" 
          onClick={handleSubmit}
          disabled={uploading || !documentType || !documentFront || !selfie}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Enviar Documentos para Verificação
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Seus documentos serão analisados em até 24 horas. Mantenha seus dados atualizados.
        </p>
      </CardContent>
    </Card>
  );
};

export default KYCVerificationForm;
