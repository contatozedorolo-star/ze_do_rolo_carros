import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileCheck, Clock, CheckCircle, XCircle, Camera, CreditCard, Loader2, User, Building2 } from "lucide-react";
import { isValidCPF, isValidCNPJ } from "@/lib/validators";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface KYCVerification {
  id: string;
  document_type: string;
  document_number: string;
  document_front_url: string | null;
  document_back_url: string | null;
  selfie_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  rejection_reason: string | null;
  created_at: string;
}

const documentTypes = [
  { value: "rg", label: "RG" },
  { value: "cnh", label: "CNH" },
];

const statusInfo = {
  pending: {
    icon: Clock,
    label: "Pendente",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  under_review: {
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
  const [kycVerification, setKycVerification] = useState<KYCVerification | null>(null);
  const [personType, setPersonType] = useState<"fisica" | "juridica">("fisica");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cpfCnpjError, setCpfCnpjError] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  useEffect(() => {
    fetchKYCVerification();
  }, [user]);

  const fetchKYCVerification = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("kyc_verifications")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setKycVerification(data);
      setDocumentType(data.document_type);
      setDocumentNumber(data.document_number);
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
    // Validate CPF or CNPJ based on person type
    const cleanValue = cpfCnpj.replace(/\D/g, '');
    
    if (personType === "fisica") {
      if (!cleanValue || !isValidCPF(cleanValue)) {
        setCpfCnpjError("CPF inválido. Verifique os dígitos informados.");
        toast({
          title: "CPF inválido",
          description: "Por favor, informe um CPF válido.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!cleanValue || !isValidCNPJ(cleanValue)) {
        setCpfCnpjError("CNPJ inválido. Verifique os dígitos informados.");
        toast({
          title: "CNPJ inválido",
          description: "Por favor, informe um CNPJ válido.",
          variant: "destructive",
        });
        return;
      }
    }
    setCpfCnpjError("");

    if (!user || !documentType || !documentNumber || !documentFront || !selfie) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos e faça upload dos arquivos necessários.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const timestamp = Date.now();
      const cleanValue = cpfCnpj.replace(/\D/g, '');
      
      // Upload files
      const frontPath = await uploadFile(documentFront, `${user.id}/doc_front_${timestamp}.${documentFront.name.split('.').pop()}`);
      const backPath = documentBack ? await uploadFile(documentBack, `${user.id}/doc_back_${timestamp}.${documentBack.name.split('.').pop()}`) : null;
      const selfiePath = await uploadFile(selfie, `${user.id}/selfie_${timestamp}.${selfie.name.split('.').pop()}`);

      if (!frontPath || !selfiePath) {
        throw new Error("Erro ao fazer upload dos arquivos");
      }

      // Update CPF or CNPJ in profile based on person type
      if (personType === "fisica") {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ cpf: cleanValue })
          .eq("id", user.id);

        if (profileError) {
          console.error("Error updating CPF in profile:", profileError);
        }
      } else {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ cnpj: cleanValue })
          .eq("id", user.id);

        if (profileError) {
          console.error("Error updating CNPJ in profile:", profileError);
        }
      }

      // Create or update KYC verification
      if (kycVerification && kycVerification.status === 'pending') {
        const { error } = await supabase
          .from("kyc_verifications")
          .update({
            document_type: documentType,
            document_number: documentNumber,
            document_front_url: frontPath,
            document_back_url: backPath,
            selfie_url: selfiePath,
            status: 'under_review',
          })
          .eq("id", kycVerification.id);

        if (error) throw error;
      } else if (!kycVerification) {
        const { error } = await supabase
          .from("kyc_verifications")
          .insert({
            user_id: user.id,
            document_type: documentType,
            document_number: documentNumber,
            document_front_url: frontPath,
            document_back_url: backPath,
            selfie_url: selfiePath,
            status: 'under_review',
          });

        if (error) throw error;
      }

      toast({
        title: "Documentos enviados!",
        description: "Sua solicitação de verificação foi enviada e será analisada em breve.",
      });

      // Refresh data
      await fetchKYCVerification();
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
  if (kycVerification && kycVerification.status !== 'pending') {
    const status = statusInfo[kycVerification.status];
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
                  {kycVerification.status === 'under_review' && "Seus documentos estão sendo analisados. Isso pode levar até 24 horas."}
                  {kycVerification.status === 'approved' && "Sua identidade foi verificada com sucesso!"}
                  {kycVerification.status === 'rejected' && "Sua verificação foi rejeitada. Veja os motivos abaixo."}
                </p>
              </div>
            </div>
          </div>

          {kycVerification.status === 'rejected' && kycVerification.rejection_reason && (
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <p className="text-sm font-medium text-destructive mb-1">Motivo da rejeição:</p>
              <p className="text-sm text-muted-foreground">{kycVerification.rejection_reason}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setKycVerification(null)}
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>Documento: {documentTypes.find(d => d.value === kycVerification.document_type)?.label}</p>
            <p>Número: {kycVerification.document_number}</p>
            <p>Enviado em: {new Date(kycVerification.created_at).toLocaleDateString('pt-BR')}</p>
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
        {/* Person Type Selection */}
        <div className="space-y-3">
          <Label>Tipo de Pessoa *</Label>
          <RadioGroup 
            value={personType} 
            onValueChange={(value: "fisica" | "juridica") => {
              setPersonType(value);
              setCpfCnpj("");
              setCpfCnpjError("");
            }}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fisica" id="fisica" />
              <Label htmlFor="fisica" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                Pessoa Física (CPF)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="juridica" id="juridica" />
              <Label htmlFor="juridica" className="flex items-center gap-2 cursor-pointer">
                <Building2 className="h-4 w-4" />
                Pessoa Jurídica (CNPJ)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* CPF/CNPJ Field */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            {personType === "fisica" ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
            {personType === "fisica" ? "CPF *" : "CNPJ *"}
          </Label>
          <Input
            placeholder={personType === "fisica" ? "000.000.000-00" : "00.000.000/0000-00"}
            value={cpfCnpj}
            onChange={(e) => {
              const formatted = personType === "fisica" 
                ? formatCPF(e.target.value) 
                : formatCNPJ(e.target.value);
              setCpfCnpj(formatted);
              if (cpfCnpjError) setCpfCnpjError("");
            }}
            maxLength={personType === "fisica" ? 14 : 18}
            className={cpfCnpjError ? "border-destructive" : ""}
          />
          {cpfCnpjError && <p className="text-xs text-destructive">{cpfCnpjError}</p>}
          <p className="text-xs text-muted-foreground">
            {personType === "fisica" 
              ? "Seu CPF será usado para validar sua identidade." 
              : "O CNPJ será usado para validar sua empresa."}
          </p>
        </div>

        {/* Document Type Selection */}
        <div className="space-y-2">
          <Label>Tipo de Documento de Identificação *</Label>
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

        {/* Document Number */}
        <div className="space-y-2">
          <Label>Número do Documento *</Label>
          <Input
            placeholder="Número do RG ou CNH"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
          />
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
          disabled={uploading || !cpfCnpj || !documentType || !documentNumber || !documentFront || !selfie}
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
