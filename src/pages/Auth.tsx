import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield, CheckCircle, ArrowLeft, Car, Lock, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { z } from "zod";
import { isValidPhone } from "@/lib/validators";


const signUpSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("Email inválido").max(255, "Email muito longo"),
  phone: z.string()
    .min(10, "Telefone inválido")
    .max(15, "Telefone inválido")
    .refine((val) => isValidPhone(val), {
      message: "Telefone inválido. Use o formato (XX) XXXXX-XXXX"
    }),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos para continuar" })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

const newPasswordSchema = z.object({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sessionReady, setSessionReady] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const { user, session, signUp, signIn, signInWithGoogle, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the intended destination from state or default to dashboard
  const from = (location.state as { from?: string })?.from || "/dashboard";
  const isRestrictedRedirect = from === "/veiculos" || from === "/assistente-ia";

  // Handle password reset mode - detect hash fragment from Supabase recovery link
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    
    if (urlMode === 'reset') {
      setMode('reset');
      
      // Check if there's a hash fragment with access_token (from Supabase recovery link)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      const errorCode = hashParams.get('error_code');
      const errorDescription = hashParams.get('error_description');
      
      // Check for error in hash (e.g., expired or invalid link)
      if (errorCode || errorDescription) {
        console.error('Recovery link error:', errorCode, errorDescription);
        toast({
          title: "Link inválido",
          description: errorDescription?.replace(/\+/g, ' ') || "O link de redefinição de senha é inválido ou expirou. Solicite um novo.",
          variant: "destructive",
        });
        setMode('forgot');
        // Clean up the URL hash
        window.history.replaceState(null, '', window.location.pathname + '?mode=forgot');
        return;
      }
      
      if (accessToken && type === 'recovery') {
        // Set the session using the tokens from the recovery link
        import('@/integrations/supabase/client').then(({ supabase }) => {
          supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          }).then(({ error }) => {
            if (error) {
              console.error('Error setting session:', error);
              toast({
                title: "Link expirado",
                description: "O link de redefinição de senha expirou. Solicite um novo.",
                variant: "destructive",
              });
              setMode('forgot');
            } else {
              setSessionReady(true);
              // Clean up the URL hash
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          });
        });
      } else if (accessToken) {
        // Handle other token types (like email confirmation that was used for password change)
        import('@/integrations/supabase/client').then(({ supabase }) => {
          supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          }).then(({ error }) => {
            if (error) {
              console.error('Error setting session:', error);
              // Don't show error, just mark as needing a new request
              setMode('forgot');
            } else {
              setSessionReady(true);
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          });
        });
      } else if (session) {
        // Session already exists (user already authenticated via recovery)
        setSessionReady(true);
      } else {
        // No token in URL and no session - user might have navigated directly
        // Wait a bit for session to be loaded from storage
        const checkSession = async () => {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession) {
            setSessionReady(true);
          }
        };
        
        setTimeout(checkSession, 500);
      }
    } else if (urlMode === 'signup') {
      setMode('signup');
    }
  }, [searchParams, toast]);

  // Mark session as ready when session becomes available in reset mode
  useEffect(() => {
    if (mode === 'reset' && session) {
      setSessionReady(true);
    }
  }, [mode, session]);

  useEffect(() => {
    if (user && mode !== 'reset') {
      navigate(from, { replace: true });
    }
  }, [user, navigate, mode, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (mode === 'signup') {
        const result = signUpSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.full_name,
          phone: formData.phone.replace(/\D/g, ''),
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Email já cadastrado",
              description: "Este email já está em uso. Tente fazer login.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro no cadastro",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Cadastro realizado!",
            description: "Verifique seu email para confirmar a conta.",
          });
          // Automatically switch to login mode after successful signup
          setMode('signin');
          // Clear password fields for security
          setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
        }
      } else if (mode === 'signin') {
        const result = signInSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Credenciais inválidas",
              description: "Email ou senha incorretos.",
              variant: "destructive",
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email não confirmado",
              description: "Por favor, confirme seu email antes de fazer login.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro no login",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      } else if (mode === 'forgot') {
        const result = resetPasswordSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await resetPassword(formData.email);

        if (error) {
          toast({
            title: "Erro ao enviar email",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Email enviado!",
            description: "Verifique sua caixa de entrada para redefinir sua senha.",
          });
          setMode('signin');
        }
      } else if (mode === 'reset') {
        const result = newPasswordSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        // Check if session is ready before updating password
        if (!sessionReady && !session) {
          toast({
            title: "Aguarde",
            description: "Verificando sua sessão...",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error } = await updatePassword(formData.password);

        if (error) {
          // Handle specific error messages
          if (error.message.includes('Auth session missing')) {
            toast({
              title: "Link expirado",
              description: "O link de redefinição de senha expirou. Solicite um novo.",
              variant: "destructive",
            });
            setMode('forgot');
          } else {
            toast({
              title: "Erro ao redefinir senha",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Senha redefinida!",
            description: "Sua senha foi alterada com sucesso.",
          });
          navigate('/dashboard');
        }
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup': return "Crie sua conta";
      case 'forgot': return "Esqueceu sua senha?";
      case 'reset': return "Redefinir senha";
      default: return "Bem-vindo de volta";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return "Cadastre-se e comece a negociar veículos com segurança";
      case 'forgot': return "Digite seu email e enviaremos instruções para recuperar sua senha";
      case 'reset': return "Digite sua nova senha";
      default: return "Entre na sua conta para continuar";
    }
  };

  const getButtonText = () => {
    if (loading) return "Carregando...";
    if (mode === 'reset' && !sessionReady && !session) return "Verificando sessão...";
    switch (mode) {
      case 'signup': return "Criar Conta";
      case 'forgot': return "Enviar Email";
      case 'reset': return "Redefinir Senha";
      default: return "Entrar";
    }
  };

  // Check if button should be disabled
  const isButtonDisabled = loading || (mode === 'reset' && !sessionReady && !session);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img 
                src="/logo-zedorolo.png" 
                alt="Zé do Rolo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{getTitle()}</h1>
            <p className="text-muted-foreground mt-2">{getSubtitle()}</p>
          </div>

          {/* Restricted Access Banner */}
          {isRestrictedRedirect && (
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Lock className="h-5 w-5" />
                <span className="font-semibold">Acesso Restrito</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Para ver nossas melhores ofertas e conversar com o <span className="font-semibold text-foreground">Zé IA</span>, você precisa fazer parte da comunidade <span className="font-semibold text-primary">Zé do Rolo</span>! 
                <br />
                <span className="text-accent font-medium">Cadastre-se agora, é rápido e seguro.</span>
              </p>
            </div>
          )}

          {/* Trust Badges */}
          {mode === 'signup' && !isRestrictedRedirect && (
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-accent">
                <Shield className="h-4 w-4" />
                <span>Dados Protegidos</span>
              </div>
              <div className="flex items-center gap-1 text-accent">
                <CheckCircle className="h-4 w-4" />
                <span>Verificação Anti-Fraude</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="Seu nome completo"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={errors.full_name ? "border-destructive" : ""}
                  />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone / WhatsApp</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => {
                      e.target.value = formatPhone(e.target.value);
                      handleChange(e);
                    }}
                    maxLength={15}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

              </>
            )}

            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            )}

            {(mode === 'signin' || mode === 'signup' || mode === 'reset') && (
              <div className="space-y-2">
                <Label htmlFor="password">{mode === 'reset' ? 'Nova Senha' : 'Senha'}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
            )}

            {(mode === 'signup' || mode === 'reset') && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({ ...prev, acceptedTerms: checked === true }));
                      if (errors.acceptedTerms) {
                        setErrors(prev => ({ ...prev, acceptedTerms: "" }));
                      }
                    }}
                    className={errors.acceptedTerms ? "border-destructive" : ""}
                  />
                  <Label htmlFor="acceptedTerms" className="text-sm leading-relaxed cursor-pointer">
                    Li e concordo com os{" "}
                    <Link to="/termos-de-uso" target="_blank" className="text-primary hover:underline font-medium">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link to="/politica-de-privacidade" target="_blank" className="text-primary hover:underline font-medium">
                      Política de Privacidade
                    </Link>
                  </Label>
                </div>
                {errors.acceptedTerms && <p className="text-xs text-destructive">{errors.acceptedTerms}</p>}
              </div>
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            )}

            <Button type="submit" variant="cta" size="lg" className="w-full" disabled={isButtonDisabled}>
              {getButtonText()}
            </Button>

            {/* Google Sign In - Only for signin mode */}
            {mode === 'signin' && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">ou continue com</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={async () => {
                    setLoading(true);
                    const { error } = await signInWithGoogle(from);
                    if (error) {
                      toast({
                        title: "Erro ao entrar com Google",
                        description: error.message,
                        variant: "destructive",
                      });
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Entrar com Google
                </Button>
              </>
            )}
          </form>

          {/* Toggle / Back */}
          <div className="text-center space-y-2">
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para login
              </button>
            )}
            
            {(mode === 'signin' || mode === 'signup') && (
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {mode === 'signin' 
                  ? "Não tem conta? Cadastre-se" 
                  : "Já tem uma conta? Entrar"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-lg text-center text-primary-foreground">
          <div className="flex justify-center mb-6">
            <Car className="h-16 w-16 opacity-90" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Negocie Veículos com Segurança Total
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Somos seus corretores de veículos pessoais. Encontramos a troca ou venda perfeita, 
            com segurança anti-fraude do início ao fim.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-primary-foreground/10 rounded-lg p-4">
              <CheckCircle className="h-6 w-6 text-accent" />
              <span>Verificação de identidade obrigatória</span>
            </div>
            <div className="flex items-center gap-3 bg-primary-foreground/10 rounded-lg p-4">
              <Shield className="h-6 w-6 text-accent" />
              <span>Diagnóstico completo de veículos</span>
            </div>
            <div className="flex items-center gap-3 bg-primary-foreground/10 rounded-lg p-4">
              <CheckCircle className="h-6 w-6 text-accent" />
              <span>Intermediação segura de negociações</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
