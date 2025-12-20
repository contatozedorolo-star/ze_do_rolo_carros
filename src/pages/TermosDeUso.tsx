import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermosDeUso = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="bg-card rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Termos de Uso</h1>
          <p className="text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none space-y-6 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar a plataforma Zé do Rolo ("Plataforma"), você ("Usuário") concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
              </p>
              <p>
                A Plataforma reserva-se o direito de modificar estes Termos a qualquer momento, sendo de responsabilidade do Usuário verificar periodicamente as atualizações.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Descrição dos Serviços</h2>
              <p>
                O Zé do Rolo é uma plataforma digital que facilita a compra, venda e troca de veículos entre usuários. Nossos serviços incluem:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Publicação de anúncios de veículos para venda ou troca;</li>
                <li>Sistema de busca e filtros para encontrar veículos;</li>
                <li>Ferramentas de comunicação entre compradores e vendedores;</li>
                <li>Consulta de valores da Tabela FIPE;</li>
                <li>Sistema de propostas e negociação;</li>
                <li>Verificação de identidade dos usuários (KYC).</li>
              </ul>
              <p className="mt-4">
                <strong>Importante:</strong> O Zé do Rolo atua exclusivamente como intermediário, não sendo parte das transações realizadas entre os usuários.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Cadastro e Conta do Usuário</h2>
              <p>
                Para utilizar determinadas funcionalidades da Plataforma, o Usuário deverá criar uma conta, fornecendo informações verdadeiras, completas e atualizadas. O Usuário é responsável por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manter a confidencialidade de suas credenciais de acesso;</li>
                <li>Todas as atividades realizadas em sua conta;</li>
                <li>Notificar imediatamente a Plataforma sobre qualquer uso não autorizado;</li>
                <li>Manter seus dados cadastrais sempre atualizados.</li>
              </ul>
              <p className="mt-4">
                O Usuário deve ter no mínimo 18 anos de idade para criar uma conta e utilizar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Anúncios e Publicações</h2>
              <p>
                Ao publicar um anúncio na Plataforma, o Usuário declara e garante que:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>É o legítimo proprietário do veículo ou possui autorização expressa para anunciá-lo;</li>
                <li>Todas as informações fornecidas são verdadeiras e precisas;</li>
                <li>O veículo não possui qualquer impedimento legal para comercialização;</li>
                <li>As fotos e descrições correspondem fielmente ao estado atual do veículo;</li>
                <li>O diagnóstico técnico (checklist de 0 a 10) reflete honestamente as condições do veículo.</li>
              </ul>
              <p className="mt-4">
                A Plataforma reserva-se o direito de remover, sem aviso prévio, anúncios que violem estes Termos ou que contenham informações falsas ou enganosas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Condutas Proibidas</h2>
              <p>
                É expressamente proibido ao Usuário:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer informações falsas ou enganosas;</li>
                <li>Anunciar veículos roubados, adulterados ou com documentação irregular;</li>
                <li>Utilizar a Plataforma para fins ilegais ou fraudulentos;</li>
                <li>Assediar, ameaçar ou difamar outros usuários;</li>
                <li>Tentar acessar contas de terceiros sem autorização;</li>
                <li>Utilizar softwares automatizados para coletar dados da Plataforma;</li>
                <li>Publicar conteúdo ofensivo, discriminatório ou ilegal;</li>
                <li>Burlar os sistemas de segurança da Plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Sistema de Trocas ("Lote")</h2>
              <p>
                O Zé do Rolo oferece um sistema inovador de trocas de veículos. Ao utilizar este recurso:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>O Usuário pode propor trocas com ou sem complemento em dinheiro ("volta");</li>
                <li>As propostas de troca são vinculativas após aceitas por ambas as partes;</li>
                <li>A Plataforma pode mediar conflitos, mas a responsabilidade final é dos usuários envolvidos;</li>
                <li>Todas as trocas devem cumprir a legislação vigente sobre transferência de veículos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Responsabilidades e Limitações</h2>
              <p>
                <strong>Responsabilidade do Zé do Rolo:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manter a Plataforma disponível e funcional;</li>
                <li>Proteger os dados dos usuários conforme a LGPD;</li>
                <li>Verificar a identidade dos usuários cadastrados;</li>
                <li>Fornecer ferramentas seguras para negociação.</li>
              </ul>
              <p className="mt-4">
                <strong>Limitações de Responsabilidade:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Não garantimos a veracidade das informações fornecidas pelos usuários;</li>
                <li>Não nos responsabilizamos por transações realizadas fora da Plataforma;</li>
                <li>Não somos responsáveis por vícios ocultos nos veículos negociados;</li>
                <li>Não garantimos a conclusão de qualquer negociação.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da Plataforma, incluindo mas não se limitando a textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade do Zé do Rolo ou de seus fornecedores de conteúdo e é protegido pelas leis brasileiras e internacionais de propriedade intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Suspensão e Cancelamento</h2>
              <p>
                A Plataforma pode, a seu exclusivo critério:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Suspender temporariamente ou permanentemente contas que violem estes Termos;</li>
                <li>Remover anúncios que não estejam em conformidade;</li>
                <li>Recusar o cadastro de novos usuários;</li>
                <li>Encerrar a prestação de serviços mediante aviso prévio de 30 dias.</li>
              </ul>
              <p className="mt-4">
                O Usuário pode solicitar o cancelamento de sua conta a qualquer momento através das configurações de perfil ou entrando em contato conosco.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Disposições Gerais</h2>
              <p>
                <strong>Lei Aplicável:</strong> Estes Termos são regidos pelas leis da República Federativa do Brasil.
              </p>
              <p className="mt-2">
                <strong>Foro:</strong> Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias decorrentes destes Termos.
              </p>
              <p className="mt-2">
                <strong>Independência das Cláusulas:</strong> Se qualquer disposição destes Termos for considerada inválida, as demais disposições permanecerão em pleno vigor e efeito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Contato</h2>
              <p>
                Para dúvidas, sugestões ou reclamações relacionadas a estes Termos de Uso, entre em contato conosco:
              </p>
              <ul className="list-none mt-2 space-y-1">
                <li><strong>E-mail:</strong> contato@zedorolo.com.br</li>
                <li><strong>Telefone:</strong> (11) 9999-9999</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermosDeUso;
