import { Shield, Package, Users, CreditCard, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Shield,
      title: "Verificação Total",
      description: "Você se cadastra e nós verificamos sua identidade. CPF, documentos e biometria garantem que todos aqui são reais.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
    },
    {
      number: "02",
      icon: Package,
      title: "Monte Seu Lote",
      description: "Cadastre seus itens (o que você tem) e o que você busca (o que você precisa). Quanto mais detalhes, melhor a curadoria.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/30",
    },
    {
      number: "03",
      icon: Users,
      title: "A Curadoria Ativa",
      description: "Nossos corretores encontram a melhor troca para você. Receba propostas qualificadas de vendedores verificados.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      number: "04",
      icon: CreditCard,
      title: "Troca Segura (Zé Pay)",
      description: "Você inspeciona, aprova e só então o pagamento/troca é liberado. Zero risco de fraude ou golpe.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
    },
  ];

  const painPoints = [
    "Vendedores fantasmas que somem após o pagamento",
    "Produtos que não correspondem às fotos",
    "Golpes em transações de alto valor",
    "Falta de garantia e suporte pós-venda",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-hero py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-accent">Segurança é Nossa Prioridade</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                Como o <span className="text-secondary">Zé do Rolo</span> Funciona
              </h1>
              
              <p className="text-lg text-primary-foreground/80">
                Entenda como transformamos a experiência de compra, venda e troca em algo 
                <strong className="text-accent"> 100% seguro</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 mb-4">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-semibold text-destructive">O Problema</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  O Que Acontece nos Marketplaces Tradicionais
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Milhares de pessoas são vítimas de golpes todos os dias. A falta de verificação 
                  e garantias deixa compradores e vendedores vulneráveis.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {painPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                      <span className="text-destructive text-sm">✕</span>
                    </div>
                    <p className="text-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-4">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-accent">A Solução</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                O Fluxo Zé do Rolo
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                4 passos simples que garantem segurança total em todas as suas negociações.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`relative flex flex-col md:flex-row items-start gap-6 p-6 md:p-8 rounded-2xl border ${step.borderColor} ${step.bgColor} transition-all hover:scale-[1.02]`}
                >
                  {/* Step Number */}
                  <div className={`shrink-0 w-16 h-16 rounded-2xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center`}>
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm font-bold ${step.color}`}>PASSO {step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute left-[2rem] top-full w-0.5 h-8 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 gradient-hero">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold text-primary-foreground">
                Pronto para Negociar com Segurança?
              </h2>
              <p className="text-primary-foreground/80">
                Cadastre-se agora e faça parte da comunidade de vendedores e compradores verificados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" className="group" asChild>
                  <Link to="/auth">
                    Cadastre-se Grátis
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/veiculos">Ver Veículos</Link>
                </Button>
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
