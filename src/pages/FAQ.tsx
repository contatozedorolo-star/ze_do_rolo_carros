import { useState } from "react";
import { HelpCircle, ChevronDown, Shield, Car, ArrowRightLeft, CreditCard, FileText, Users, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  questions: { q: string; a: string }[];
}

const faqCategories: FAQCategory[] = [
  {
    id: "geral",
    title: "Sobre o Zé do Rolo",
    icon: HelpCircle,
    questions: [
      {
        q: "O que é o Zé do Rolo?",
        a: "O Zé do Rolo é uma plataforma de intermediação para compra, venda e troca de veículos. Diferente de marketplaces comuns, nós verificamos a identidade de todos os usuários e acompanhamos a negociação do início ao fim, garantindo segurança para ambas as partes."
      },
      {
        q: "O Zé do Rolo é gratuito?",
        a: "Sim! O cadastro e a publicação de anúncios são totalmente gratuitos. Você só paga uma pequena taxa de sucesso quando a negociação é concluída com êxito."
      },
      {
        q: "Como o Zé do Rolo é diferente de outros sites de veículos?",
        a: "Nossa principal diferença é a curadoria ativa. Verificamos todos os usuários, analisamos propostas de troca para evitar perda de tempo, e acompanhamos a documentação. Você negocia com tranquilidade sabendo que todos são verificados."
      },
      {
        q: "Em quais cidades o Zé do Rolo atua?",
        a: "Atuamos em todo o Brasil! Você pode anunciar e buscar veículos em qualquer estado. Nosso sistema permite filtrar por localização para encontrar negócios próximos a você."
      },
    ]
  },
  {
    id: "seguranca",
    title: "Segurança e Verificação",
    icon: Shield,
    questions: [
      {
        q: "Como funciona a verificação de usuários?",
        a: "Todos os usuários passam por um processo de verificação que inclui: confirmação de CPF/CNPJ, validação por SMS, e análise de documentos. Isso garante que você negocia apenas com pessoas reais e identificadas."
      },
      {
        q: "É seguro negociar pelo Zé do Rolo?",
        a: "Sim! Nossa plataforma foi desenvolvida com foco total em segurança. Além da verificação de usuários, oferecemos suporte na conferência de documentação e acompanhamos todo o processo de transferência do veículo."
      },
      {
        q: "O que acontece se eu encontrar um perfil suspeito?",
        a: "Você pode denunciar qualquer perfil ou anúncio suspeito diretamente pela plataforma. Nossa equipe analisa todas as denúncias em até 24 horas e toma as medidas necessárias para proteger a comunidade."
      },
      {
        q: "Meus dados pessoais estão protegidos?",
        a: "Absolutamente. Seguimos a LGPD (Lei Geral de Proteção de Dados) e utilizamos criptografia de ponta a ponta. Seus dados pessoais nunca são compartilhados com terceiros sem sua autorização."
      },
    ]
  },
  {
    id: "anuncios",
    title: "Anúncios e Veículos",
    icon: Car,
    questions: [
      {
        q: "Como faço para anunciar meu veículo?",
        a: "É simples! Crie sua conta, clique em 'Anunciar', escolha o tipo de veículo, preencha as informações, responda ao diagnóstico de 0 a 10 sobre a condição do veículo, e faça o upload das fotos. Seu anúncio estará no ar em minutos!"
      },
      {
        q: "Quantas fotos posso adicionar ao anúncio?",
        a: "Exigimos no mínimo 6 fotos obrigatórias (frente, traseira, laterais, interior e painel). Quanto mais fotos e detalhes você adicionar, mais confiança seu anúncio transmite e mais rápido você fecha negócio."
      },
      {
        q: "O que é o diagnóstico de 0 a 10?",
        a: "É nossa ferramenta de transparência. Você avalia cada componente do veículo (motor, câmbio, freios, estética, etc.) de 0 a 10. Isso ajuda compradores a entenderem a real condição do veículo e evita surpresas desagradáveis."
      },
      {
        q: "Posso editar meu anúncio depois de publicar?",
        a: "Sim! Você pode editar preço, descrição, fotos e todas as informações do anúncio a qualquer momento através do seu painel de controle."
      },
      {
        q: "Como consultar o valor do meu veículo na Tabela FIPE?",
        a: "Temos uma página dedicada de consulta à Tabela FIPE integrada ao site. Acesse pelo menu 'Tabela FIPE' e consulte o valor de referência de carros, motos e caminhões em tempo real."
      },
    ]
  },
  {
    id: "trocas",
    title: "Trocas e Negociações",
    icon: ArrowRightLeft,
    questions: [
      {
        q: "Como funciona a troca de veículos?",
        a: "Você indica no anúncio que aceita troca e descreve o que procura. Quando receber propostas, nossa curadoria filtra as mais relevantes. Você avalia as propostas qualificadas e negocia diretamente com o interessado."
      },
      {
        q: "O que é o 'Lote' no Zé do Rolo?",
        a: "O Lote é quando você combina seu veículo + dinheiro (ou outro item) para alcançar um veículo de maior valor. Por exemplo: seu carro de R$ 30 mil + R$ 20 mil = carro de R$ 50 mil. É uma forma inteligente de fazer upgrade sem financiamento."
      },
      {
        q: "Posso trocar carro por moto ou vice-versa?",
        a: "Sim! Você pode propor trocas entre diferentes tipos de veículos. Basta indicar no seu anúncio o que você aceita receber e nossa plataforma mostrará seu anúncio para os interessados certos."
      },
      {
        q: "Como funciona a 'volta' em dinheiro?",
        a: "Quando os veículos têm valores diferentes, a diferença é acertada em dinheiro. Você pode definir no anúncio quanto aceita de volta mínima ou quanto está disposto a dar de volta."
      },
      {
        q: "O Zé do Rolo filtra propostas ruins?",
        a: "Sim! Nossa curadoria analisa as propostas e filtra aquelas que não fazem sentido (como oferecer uma bicicleta por um carro). Você recebe apenas propostas relevantes ao que está buscando."
      },
    ]
  },
  {
    id: "pagamentos",
    title: "Pagamentos e Taxas",
    icon: CreditCard,
    questions: [
      {
        q: "Quanto custa usar o Zé do Rolo?",
        a: "O cadastro e publicação de anúncios são gratuitos. Cobramos apenas uma taxa de sucesso quando você fecha um negócio pela plataforma. A taxa varia conforme o valor da transação."
      },
      {
        q: "Como é feito o pagamento entre comprador e vendedor?",
        a: "O pagamento é combinado diretamente entre as partes. Recomendamos sempre usar meios seguros como transferência bancária (TED/PIX) e nunca entregar o veículo antes de confirmar o recebimento."
      },
      {
        q: "Existe algum sistema de pagamento seguro?",
        a: "Estamos desenvolvendo o 'Zé Pay', um sistema de escrow (pagamento garantido) onde o dinheiro fica retido conosco até que ambas as partes confirmem a conclusão do negócio. Em breve!"
      },
    ]
  },
  {
    id: "documentacao",
    title: "Documentação",
    icon: FileText,
    questions: [
      {
        q: "O Zé do Rolo ajuda com a documentação?",
        a: "Sim! Oferecemos orientação sobre toda a documentação necessária para transferência de veículos e podemos indicar despachantes parceiros para facilitar o processo."
      },
      {
        q: "Quais documentos preciso para vender meu veículo?",
        a: "Você precisa do CRV (Certificado de Registro de Veículo) preenchido e assinado, documento de identidade, comprovante de residência, e o veículo sem multas ou débitos pendentes."
      },
      {
        q: "Como sei se o veículo tem débitos ou restrições?",
        a: "Recomendamos sempre consultar a situação do veículo antes de fechar negócio. Você pode fazer isso no site do DETRAN do seu estado ou através de serviços de consulta veicular."
      },
    ]
  },
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("geral");

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const displayCategories = searchTerm ? filteredCategories : faqCategories;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-hero py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
          </div>
          
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30">
                <HelpCircle className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-secondary">Central de Ajuda</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground">
                Perguntas <span className="text-secondary">Frequentes</span>
              </h1>
              
              <p className="text-lg text-primary-foreground/80">
                Tire suas dúvidas sobre o funcionamento do Zé do Rolo
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto pt-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar pergunta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-card border-transparent text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12 container">
          <div className="max-w-5xl mx-auto">
            {/* Category Tabs */}
            {!searchTerm && (
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {faqCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.title}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Questions */}
            {displayCategories.map((category) => {
              if (!searchTerm && category.id !== activeCategory) return null;
              
              return (
                <div key={category.id} className="mb-8">
                  {searchTerm && (
                    <div className="flex items-center gap-2 mb-4">
                      <category.icon className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-bold text-foreground">{category.title}</h2>
                      <span className="text-sm text-muted-foreground">
                        ({category.questions.length} {category.questions.length === 1 ? 'resultado' : 'resultados'})
                      </span>
                    </div>
                  )}
                  
                  <Accordion type="single" collapsible className="space-y-3">
                    {category.questions.map((item, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${category.id}-${index}`}
                        className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-card"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}

            {searchTerm && displayCategories.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-muted-foreground">
                  Tente buscar com outras palavras ou navegue pelas categorias
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Ainda tem dúvidas?
              </h2>
              <p className="text-muted-foreground">
                Nossa equipe está pronta para ajudar você. Entre em contato!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="cta" size="lg" asChild>
                  <Link to="/auth">Criar Minha Conta</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/how-it-works">Como Funciona</Link>
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

export default FAQ;
