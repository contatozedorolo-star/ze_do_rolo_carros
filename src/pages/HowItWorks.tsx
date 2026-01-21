import { 
  Shield, 
  ClipboardCheck, 
  Handshake, 
  Key, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  TrendingUp,
  Users,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Shield,
      title: "Cadastro e Verificação",
      description: "Você cria sua conta e nós validamos sua identidade. Aqui não existem perfis falsos.",
      details: ["Verificação de CPF/CNPJ", "Confirmação por SMS", "Análise de documentos"],
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
    },
    {
      number: "02",
      icon: ClipboardCheck,
      title: "Diagnóstico Transparente",
      description: "Ao anunciar, você responde ao nosso Check-list de 0 a 10. Honestidade gera negócios mais rápidos.",
      details: ["Avaliação de motor e câmbio", "Estado da lataria e pneus", "Situação da documentação"],
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/30",
    },
    {
      number: "03",
      icon: Handshake,
      title: "Curadoria de Match",
      description: "Nossa equipe analisa as propostas de troca. Se você quer uma moto e oferecem um carro fora do seu interesse, nós filtramos para você não perder tempo.",
      details: ["Filtro inteligente de propostas", "Notificação de matches", "Sugestões personalizadas"],
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      number: "04",
      icon: Key,
      title: "Negócio Fechado",
      description: "Garantimos a segurança na documentação e na transferência. No Zé do Rolo, você negocia tudo, menos a sua segurança.",
      details: ["Conferência de documentos", "Apoio na transferência", "Segurança total"],
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
    },
  ];

  const benefits = [
    {
      icon: Lock,
      title: "Zero Golpes",
      description: "Todos os usuários são verificados antes de negociar"
    },
    {
      icon: Users,
      title: "Curadoria Humana",
      description: "Equipe dedicada para filtrar propostas sérias"
    },
    {
      icon: TrendingUp,
      title: "Negócios Rápidos",
      description: "Transparência acelera o fechamento de acordos"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-hero py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
          </div>
          
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-accent">Segurança é Nossa Prioridade</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
                Zé do Rolo: O Jeito Seguro de{" "}
                <span className="text-secondary">Trocar ou Vender</span> seu Veículo.
              </h1>
              
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
                Diferente de marketplaces comuns, nós acompanhamos você{" "}
                <strong className="text-accent">do anúncio até a entrega das chaves</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Bar */}
        <section className="py-8 bg-muted/30 border-y border-border">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                O Fluxo em <span className="text-secondary">4 Passos</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Simples, transparente e seguro do início ao fim.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid gap-8">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`relative flex flex-col md:flex-row items-start gap-6 p-6 md:p-8 rounded-2xl border-2 ${step.borderColor} bg-card shadow-card hover:shadow-card-hover transition-all`}
                  >
                    {/* Step Number & Icon */}
                    <div className="shrink-0 flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center`}>
                        <step.icon className={`h-8 w-8 ${step.color}`} />
                      </div>
                      <span className={`text-4xl font-bold ${step.color} opacity-30 md:hidden`}>
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`hidden md:block text-sm font-bold ${step.color} px-3 py-1 rounded-full ${step.bgColor}`}>
                          PASSO {step.number}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      
                      {/* Details */}
                      <div className="flex flex-wrap gap-2">
                        {step.details.map((detail, i) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground"
                          >
                            <CheckCircle className="h-3 w-3 text-accent" />
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Large Step Number - Desktop */}
                    <div className="hidden md:flex shrink-0 w-20 h-20 items-center justify-center">
                      <span className={`text-6xl font-bold ${step.color} opacity-20`}>
                        {step.number}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lote Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-secondary" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        O Poder da Troca <span className="text-secondary">(Lote)</span>
                      </h2>
                      
                      <p className="text-lg text-muted-foreground">
                        Tem um carro de <strong className="text-foreground">R$ 30 mil</strong> e quer um de{" "}
                        <strong className="text-foreground">R$ 50 mil</strong>?
                      </p>
                      
                      <p className="text-muted-foreground">
                        No Zé do Rolo você pode montar um <strong className="text-secondary">"Lote"</strong>{" "}
                        (Seu carro + uma volta em dinheiro ou outro item) para chegar no valor que precisa{" "}
                        <strong className="text-accent">sem precisar de financiamentos abusivos</strong>.
                      </p>

                      <div className="pt-4">
                        <div className="inline-flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                          <div className="text-center px-4">
                            <p className="text-xs text-muted-foreground">Seu Carro</p>
                            <p className="text-lg font-bold text-foreground">R$ 30.000</p>
                          </div>
                          <span className="text-2xl text-secondary">+</span>
                          <div className="text-center px-4">
                            <p className="text-xs text-muted-foreground">Volta</p>
                            <p className="text-lg font-bold text-foreground">R$ 20.000</p>
                          </div>
                          <span className="text-2xl text-secondary">=</span>
                          <div className="text-center px-4 bg-accent/10 rounded-lg py-2">
                            <p className="text-xs text-accent">Carro Novo</p>
                            <p className="text-lg font-bold text-accent">R$ 50.000</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          </div>
          
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Pronto para Negociar com{" "}
                <span className="text-accent">Segurança Total</span>?
              </h2>
              <p className="text-lg text-primary-foreground/80">
                Junte-se a milhares de pessoas que já descobriram o jeito mais seguro de comprar, vender ou trocar veículos.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="xl" 
                  className="group bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta text-lg px-10"
                  asChild
                >
                  <Link to="/auth">
                    Quero Começar Agora
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/veiculos">Ver Veículos Disponíveis</Link>
                </Button>
              </div>

              {/* Trust Points */}
              <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-primary-foreground/70">
                {["Cadastro Gratuito", "Sem Mensalidade", "Verificação Rápida"].map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
