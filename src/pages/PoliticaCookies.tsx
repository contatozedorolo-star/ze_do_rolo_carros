import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const PoliticaCookies = () => {
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
            <Cookie className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Política de Cookies</h1>
          </div>
          <p className="text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none space-y-6 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. O que são Cookies?</h2>
              <p>
                Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, tablet ou smartphone) quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de maneira mais eficiente, bem como para fornecer informações aos proprietários do site.
              </p>
              <p>
                Os cookies permitem que o site reconheça seu dispositivo e lembre-se de suas preferências ou ações ao longo do tempo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Por que Utilizamos Cookies?</h2>
              <p>
                O Zé do Rolo utiliza cookies para diversos fins, incluindo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Garantir o funcionamento adequado da plataforma;</li>
                <li>Manter você conectado à sua conta durante a navegação;</li>
                <li>Lembrar suas preferências e configurações;</li>
                <li>Melhorar a segurança da plataforma;</li>
                <li>Analisar como os usuários utilizam nosso site para melhorar a experiência;</li>
                <li>Personalizar conteúdo e anúncios relevantes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Tipos de Cookies que Utilizamos</h2>
              
              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.1 Cookies Estritamente Necessários</h3>
              <p>
                Esses cookies são essenciais para que você possa navegar pelo site e usar seus recursos. Sem esses cookies, serviços como autenticação de login e carrinhos de compras não podem ser fornecidos. Estes cookies não coletam informações sobre você que possam ser usadas para marketing.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mt-2">
                <p className="text-sm"><strong>Exemplos:</strong> cookies de sessão, cookies de autenticação, cookies de segurança.</p>
                <p className="text-sm mt-1"><strong>Duração:</strong> Sessão ou até 30 dias.</p>
              </div>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.2 Cookies de Desempenho e Análise</h3>
              <p>
                Esses cookies coletam informações sobre como os visitantes usam nosso site, por exemplo, quais páginas são mais visitadas e se recebem mensagens de erro. Essas informações são usadas para melhorar o funcionamento do site. Todos os dados são agregados e anônimos.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mt-2">
                <p className="text-sm"><strong>Exemplos:</strong> Google Analytics, ferramentas de monitoramento de desempenho.</p>
                <p className="text-sm mt-1"><strong>Duração:</strong> Até 2 anos.</p>
              </div>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.3 Cookies de Funcionalidade</h3>
              <p>
                Esses cookies permitem que o site lembre as escolhas que você faz (como seu nome de usuário, idioma ou região) e forneça recursos aprimorados e mais personalizados. Eles também podem ser usados para lembrar alterações que você fez no tamanho do texto, fontes e outras partes personalizáveis das páginas.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mt-2">
                <p className="text-sm"><strong>Exemplos:</strong> preferências de idioma, preferências de visualização, tema claro/escuro.</p>
                <p className="text-sm mt-1"><strong>Duração:</strong> Até 1 ano.</p>
              </div>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.4 Cookies de Marketing e Publicidade</h3>
              <p>
                Esses cookies são usados para entregar anúncios mais relevantes para você e seus interesses. Eles também são usados para limitar o número de vezes que você vê um anúncio, bem como ajudar a medir a eficácia das campanhas publicitárias. Eles geralmente são colocados por redes de publicidade com a permissão do operador do site.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mt-2">
                <p className="text-sm"><strong>Exemplos:</strong> cookies de remarketing, pixels de rastreamento.</p>
                <p className="text-sm mt-1"><strong>Duração:</strong> Até 2 anos.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Cookies de Terceiros</h2>
              <p>
                Além dos cookies próprios do Zé do Rolo, alguns cookies podem ser definidos por terceiros quando você visita nosso site. Esses terceiros incluem:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics:</strong> para análise de tráfego e comportamento do usuário;</li>
                <li><strong>Supabase:</strong> para autenticação e gerenciamento de sessão;</li>
                <li><strong>Redes sociais:</strong> para funcionalidades de compartilhamento e login social;</li>
                <li><strong>Serviços de pagamento:</strong> para processamento seguro de transações.</li>
              </ul>
              <p className="mt-4">
                Esses terceiros têm suas próprias políticas de privacidade e cookies, e recomendamos que você as consulte para obter mais informações.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Como Gerenciar Cookies</h2>
              <p>
                Você tem o direito de decidir se aceita ou rejeita cookies. Existem várias maneiras de gerenciar cookies:
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">5.1 Configurações do Navegador</h3>
              <p>
                A maioria dos navegadores permite que você controle cookies através das configurações. Você pode:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Visualizar os cookies armazenados no seu dispositivo;</li>
                <li>Excluir cookies individualmente ou em massa;</li>
                <li>Bloquear cookies de terceiros;</li>
                <li>Bloquear todos os cookies de sites específicos;</li>
                <li>Bloquear todos os cookies de serem configurados;</li>
                <li>Excluir todos os cookies quando você fechar o navegador.</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">5.2 Links para Configurações de Navegadores Populares</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Chrome:</strong> chrome://settings/cookies</li>
                <li><strong>Mozilla Firefox:</strong> about:preferences#privacy</li>
                <li><strong>Safari:</strong> Preferências {'>'} Privacidade</li>
                <li><strong>Microsoft Edge:</strong> edge://settings/privacy</li>
              </ul>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>⚠️ Atenção:</strong> Se você optar por bloquear cookies, algumas funcionalidades do site podem não funcionar corretamente. Por exemplo, você pode não conseguir fazer login ou salvar suas preferências.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Base Legal (LGPD)</h2>
              <p>
                O uso de cookies pelo Zé do Rolo está fundamentado nas seguintes bases legais da Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consentimento (Art. 7º, I):</strong> Para cookies de marketing e publicidade, solicitamos seu consentimento prévio;</li>
                <li><strong>Legítimo Interesse (Art. 7º, IX):</strong> Para cookies de análise e melhoria da plataforma;</li>
                <li><strong>Execução de Contrato (Art. 7º, V):</strong> Para cookies estritamente necessários ao funcionamento do serviço.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Retenção de Dados de Cookies</h2>
              <p>
                O período de retenção dos dados coletados através de cookies varia conforme o tipo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies de sessão:</strong> São excluídos automaticamente quando você fecha o navegador;</li>
                <li><strong>Cookies persistentes:</strong> Permanecem no seu dispositivo por um período determinado ou até que você os exclua manualmente;</li>
                <li><strong>Dados de análise:</strong> São retidos de forma agregada e anônima por até 26 meses.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Seus Direitos</h2>
              <p>
                Conforme a LGPD, você possui os seguintes direitos em relação aos dados coletados através de cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acesso:</strong> Saber quais dados estamos coletando;</li>
                <li><strong>Correção:</strong> Solicitar a correção de dados incorretos;</li>
                <li><strong>Eliminação:</strong> Solicitar a exclusão dos dados coletados;</li>
                <li><strong>Revogação do consentimento:</strong> Retirar seu consentimento a qualquer momento;</li>
                <li><strong>Oposição:</strong> Opor-se ao uso de cookies não essenciais.</li>
              </ul>
              <p className="mt-4">
                Para exercer seus direitos, entre em contato através do e-mail: <strong>privacidade@zedorolo.com.br</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Atualizações desta Política</h2>
              <p>
                Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças em nossas práticas ou por outros motivos operacionais, legais ou regulatórios. Recomendamos que você revise esta página regularmente para se manter informado sobre nosso uso de cookies.
              </p>
              <p className="mt-2">
                Quando fizermos alterações significativas, notificaremos você através de um aviso em nosso site ou por e-mail.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Contato</h2>
              <p>
                Se você tiver dúvidas sobre nossa Política de Cookies ou sobre como utilizamos cookies, entre em contato conosco:
              </p>
              <ul className="list-none mt-2 space-y-1">
                <li><strong>E-mail geral:</strong> contato@zedorolo.com.br</li>
                <li><strong>E-mail privacidade:</strong> privacidade@zedorolo.com.br</li>
                <li><strong>Telefone:</strong> (11) 98376-5437</li>
              </ul>
            </section>

            <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h2 className="text-xl font-semibold text-foreground mb-3">Mais Informações</h2>
              <p>
                Para mais informações sobre como protegemos seus dados pessoais, consulte nossa{" "}
                <Link to="/politica-de-privacidade" className="text-primary hover:underline font-medium">
                  Política de Privacidade
                </Link>{" "}
                e nossos{" "}
                <Link to="/termos-de-uso" className="text-primary hover:underline font-medium">
                  Termos de Uso
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaCookies;
