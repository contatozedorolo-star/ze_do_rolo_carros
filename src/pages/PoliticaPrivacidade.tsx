import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const PoliticaPrivacidade = () => {
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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Política de Privacidade</h1>
          </div>
          <p className="text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none space-y-6 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Introdução</h2>
              <p>
                O Zé do Rolo ("nós", "nosso" ou "Plataforma") está comprometido em proteger a privacidade e os dados pessoais de seus usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
              <p>
                Ao utilizar nossos serviços, você concorda com as práticas descritas nesta Política. Recomendamos a leitura atenta deste documento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Dados que Coletamos</h2>
              
              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.1 Dados fornecidos por você:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dados de cadastro:</strong> nome completo, CPF, e-mail, telefone, endereço (cidade e estado);</li>
                <li><strong>Dados de verificação (KYC):</strong> foto de documento de identidade (RG ou CNH), selfie para validação facial;</li>
                <li><strong>Dados de veículos:</strong> marca, modelo, ano, quilometragem, fotos, descrição, diagnóstico técnico;</li>
                <li><strong>Dados de transações:</strong> propostas enviadas e recebidas, mensagens trocadas, histórico de negociações.</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.2 Dados coletados automaticamente:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo de permanência;</li>
                <li><strong>Dados de dispositivo:</strong> tipo de dispositivo, sistema operacional, identificadores únicos;</li>
                <li><strong>Cookies e tecnologias similares:</strong> preferências de navegação, sessão de login.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Finalidades do Tratamento</h2>
              <p>
                Utilizamos seus dados pessoais para as seguintes finalidades:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Prestação de serviços:</strong> permitir a criação de conta, publicação de anúncios e realização de negociações;</li>
                <li><strong>Verificação de identidade:</strong> garantir a segurança da plataforma através do processo de KYC;</li>
                <li><strong>Comunicação:</strong> enviar notificações sobre propostas, mensagens e atualizações importantes;</li>
                <li><strong>Melhoria dos serviços:</strong> analisar o uso da plataforma para aprimorar a experiência do usuário;</li>
                <li><strong>Segurança:</strong> prevenir fraudes, abusos e atividades ilegais;</li>
                <li><strong>Cumprimento legal:</strong> atender obrigações legais e regulatórias;</li>
                <li><strong>Marketing:</strong> enviar ofertas e novidades (apenas com seu consentimento).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Bases Legais para o Tratamento</h2>
              <p>
                O tratamento de seus dados pessoais é fundamentado nas seguintes bases legais previstas na LGPD:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Execução de contrato:</strong> para prestação dos serviços contratados (Art. 7º, V);</li>
                <li><strong>Consentimento:</strong> para finalidades específicas como marketing (Art. 7º, I);</li>
                <li><strong>Legítimo interesse:</strong> para melhoria dos serviços e segurança (Art. 7º, IX);</li>
                <li><strong>Cumprimento de obrigação legal:</strong> para atender exigências legais (Art. 7º, II).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Compartilhamento de Dados</h2>
              <p>
                Seus dados podem ser compartilhados nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Entre usuários:</strong> informações de contato são compartilhadas quando há interesse mútuo em uma negociação;</li>
                <li><strong>Prestadores de serviços:</strong> empresas que nos auxiliam na operação (hospedagem, processamento de pagamentos, verificação de identidade);</li>
                <li><strong>Autoridades públicas:</strong> quando exigido por lei ou ordem judicial;</li>
                <li><strong>Proteção de direitos:</strong> para proteger nossos direitos, propriedade ou segurança.</li>
              </ul>
              <p className="mt-4">
                <strong>Importante:</strong> Não vendemos, alugamos ou comercializamos seus dados pessoais com terceiros para fins de marketing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Segurança dos Dados</h2>
              <p>
                Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais, incluindo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criptografia de dados em trânsito e em repouso;</li>
                <li>Controle de acesso restrito a informações pessoais;</li>
                <li>Monitoramento contínuo de segurança;</li>
                <li>Treinamento de equipe sobre proteção de dados;</li>
                <li>Backups regulares e planos de recuperação de desastres.</li>
              </ul>
              <p className="mt-4">
                Apesar de nossos esforços, nenhum sistema é completamente seguro. Em caso de incidente de segurança, notificaremos os afetados e as autoridades competentes conforme exigido pela LGPD.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Retenção de Dados</h2>
              <p>
                Mantemos seus dados pessoais pelo tempo necessário para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cumprir as finalidades descritas nesta Política;</li>
                <li>Atender obrigações legais e regulatórias;</li>
                <li>Exercer direitos em processos judiciais, administrativos ou arbitrais.</li>
              </ul>
              <p className="mt-4">
                Após o término do período de retenção, seus dados serão anonimizados ou excluídos de forma segura.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Seus Direitos</h2>
              <p>
                A LGPD garante a você os seguintes direitos em relação aos seus dados pessoais:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Confirmação e acesso:</strong> saber se tratamos seus dados e acessá-los;</li>
                <li><strong>Correção:</strong> solicitar a correção de dados incompletos, inexatos ou desatualizados;</li>
                <li><strong>Anonimização, bloqueio ou eliminação:</strong> de dados desnecessários ou tratados em desconformidade;</li>
                <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado;</li>
                <li><strong>Eliminação:</strong> solicitar a exclusão de dados tratados com base no consentimento;</li>
                <li><strong>Informação:</strong> saber com quem compartilhamos seus dados;</li>
                <li><strong>Revogação do consentimento:</strong> retirar seu consentimento a qualquer momento;</li>
                <li><strong>Oposição:</strong> opor-se ao tratamento em determinadas situações.</li>
              </ul>
              <p className="mt-4">
                Para exercer seus direitos, entre em contato através do e-mail: <strong>privacidade@zedorolo.com.br</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Cookies e Tecnologias de Rastreamento</h2>
              <p>
                Utilizamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies essenciais:</strong> necessários para o funcionamento da plataforma;</li>
                <li><strong>Cookies de desempenho:</strong> para analisar como os usuários utilizam o site;</li>
                <li><strong>Cookies de funcionalidade:</strong> para lembrar suas preferências;</li>
                <li><strong>Cookies de marketing:</strong> para exibir anúncios relevantes (apenas com consentimento).</li>
              </ul>
              <p className="mt-4">
                Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Menores de Idade</h2>
              <p>
                Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se tomarmos conhecimento de que coletamos dados de um menor sem o consentimento parental adequado, tomaremos medidas para excluir essas informações.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Transferência Internacional de Dados</h2>
              <p>
                Seus dados podem ser processados em servidores localizados fora do Brasil. Nesses casos, garantimos que a transferência seja realizada de acordo com a LGPD, adotando cláusulas contratuais padrão ou outras salvaguardas adequadas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações significativas, notificaremos você por e-mail ou através de um aviso em nossa plataforma. A data da última atualização será sempre indicada no início deste documento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">13. Encarregado de Proteção de Dados (DPO)</h2>
              <p>
                Nosso Encarregado de Proteção de Dados está disponível para esclarecer dúvidas e receber solicitações relacionadas ao tratamento de seus dados pessoais:
              </p>
              <ul className="list-none mt-2 space-y-1">
                <li><strong>E-mail:</strong> dpo@zedorolo.com.br</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">14. Contato</h2>
              <p>
                Para dúvidas, sugestões ou reclamações relacionadas a esta Política de Privacidade, entre em contato conosco:
              </p>
              <ul className="list-none mt-2 space-y-1">
                <li><strong>E-mail geral:</strong> contato@zedorolo.com.br</li>
                <li><strong>E-mail privacidade:</strong> privacidade@zedorolo.com.br</li>
                <li><strong>Telefone:</strong> (11) 9999-9999</li>
              </ul>
            </section>

            <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h2 className="text-xl font-semibold text-foreground mb-3">Autoridade Nacional de Proteção de Dados (ANPD)</h2>
              <p>
                Caso entenda que o tratamento de seus dados pessoais viola a legislação aplicável, você tem o direito de apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD):
              </p>
              <ul className="list-none mt-2 space-y-1">
                <li><strong>Site:</strong> www.gov.br/anpd</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
