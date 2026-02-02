import blogSuv2026 from "@/assets/blog-suv-2026.jpg";
import blogMercadoUsados from "@/assets/blog-mercado-usados.jpg";
import blogComparativoSuvs from "@/assets/blog-comparativo-suvs.jpg";
import blogHistoriaGol from "@/assets/blog-historia-gol.jpg";
import blogManutencaoPreventiva from "@/assets/blog-manutencao-preventiva.jpg";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "suvs-dominar-ruas-brasileiras-2026",
    title: "Os SUVs que vão Dominar as Ruas Brasileiras em 2026: Do Popular ao Premium",
    excerpt: "O ano de 2026 se desenha como um marco na história automotiva brasileira, prometendo uma verdadeira revolução nas concessionárias.",
    category: "Lançamentos",
    date: "15 de janeiro de 2026",
    image: blogSuv2026,
    content: `O ano de 2026 se desenha como um marco na história automotiva brasileira, prometendo uma verdadeira revolução nas concessionárias e, consequentemente, no mercado de seminovos. Com mais de 70 novos modelos previstos para chegar ao país, a categoria que mais se destaca e continua a cativar o consumidor é, sem dúvida, a dos SUVs. A versatilidade, a posição de dirigir elevada e a sensação de segurança tornam esses veículos a escolha preferida, e as novidades para este ano prometem agitar todos os segmentos, do popular ao luxo.

No segmento de entrada, a Chevrolet prepara um movimento estratégico com o lançamento do Sonic, um SUV derivado do popular Onix. Este modelo chega para competir diretamente com o Volkswagen Tera e o Fiat Pulse, prometendo um excelente custo-benefício e a confiabilidade da marca. A expectativa é que o Sonic se torne rapidamente um dos carros mais vendidos, influenciando o mercado de usados ao oferecer uma alternativa moderna e acessível.

Outro lançamento de peso vem da Fiat, que celebra seus 50 anos de presença no Brasil com a chegada do Grande Panda. Embora o nome remeta a um hatch europeu, a versão brasileira é esperada como o sucessor do Argo, inaugurando uma nova família de carros populares com design moderno e foco em eficiência. Este lançamento é crucial, pois redefine o que o consumidor espera de um carro de entrada, elevando o padrão de tecnologia e segurança.

No topo da pirâmide, o mercado de luxo recebe um novo e importante player: a Cadillac. A marca premium da General Motors fará sua estreia oficial no Brasil com os SUVs elétricos Lyriq e Optiq. Estes modelos representam o que há de mais avançado em eletrificação e sofisticação, trazendo um novo patamar de luxo e tecnologia para o país e sinalizando a consolidação da mobilidade elétrica no segmento premium.

## Principais Lançamentos 2026

| Modelo | Categoria | Impacto no Mercado |
|--------|-----------|-------------------|
| **Chevrolet Sonic** | SUV Compacto | Forte concorrente no segmento de entrada, influenciando o preço dos seminovos. |
| **Fiat Grande Panda** | Hatch/SUV | Redefine o conceito de carro popular, com foco em design e tecnologia. |
| **Cadillac Lyriq/Optiq** | SUV de Luxo Elétrico | Consolida a eletrificação no segmento premium e aumenta a concorrência. |
| **Toyota Yaris Cross** | SUV Híbrido | Fortalece a presença da tecnologia híbrida no segmento compacto. |

Em resumo, 2026 é o ano para quem busca um SUV, seja ele o primeiro carro ou um upgrade de luxo. A diversidade de lançamentos garante que haverá um modelo perfeito para cada perfil de motorista e orçamento.`
  },
  {
    id: "2",
    slug: "mercado-usados-2026-precos-alta",
    title: "Mercado de Usados em 2026: Por que os Preços Continuam em Alta?",
    excerpt: "Se você está pensando em vender seu carro ou adquirir um seminovo, certamente notou que os preços no mercado de usados mantiveram uma trajetória de alta.",
    category: "Mercado",
    date: "12 de janeiro de 2026",
    image: blogMercadoUsados,
    content: `Se você está pensando em vender seu carro ou adquirir um seminovo, certamente notou que os preços no mercado de usados mantiveram uma trajetória de alta nos últimos anos. O ano de 2026 não é exceção, e entender a dinâmica por trás dessa valorização é fundamental para fazer um bom negócio.

O principal fator que sustenta essa tendência é a maturidade do mercado e a alta demanda. O mercado de veículos usados fechou 2025 com um recorde no preço médio, um reflexo direto da busca contínua por veículos de qualidade e da menor oferta de carros novos em certas faixas de preço. Para 2026, a expectativa é de que o mercado se mantenha estável, mas com uma valorização consistente para modelos específicos.

A valorização é mais evidente em veículos que combinam confiabilidade mecânica, baixo custo de manutenção e alta liquidez. Carros que lideraram as vendas no varejo em 2025, como o Hyundai Creta e o Volkswagen Polo, são exemplos de modelos que tendem a manter um excelente valor de revenda. O consumidor está mais informado e prioriza a segurança do investimento, optando por modelos com histórico comprovado.

Além disso, a chegada de novos modelos eletrificados no mercado de zero quilômetro, embora positiva, ainda não impactou significativamente o preço dos usados a combustão. Muitos consumidores ainda preferem a tecnologia tradicional, o que mantém a demanda por carros a gasolina e etanol aquecida.

## Dicas para o Vendedor

Se você possui um modelo com boa reputação, como um SUV compacto ou um hatch popular recente, este é um ótimo momento para negociar. A manutenção preventiva em dia e um histórico de revisões completo podem aumentar o valor percebido do seu veículo em até 15%.

## Dicas para o Comprador

Priorize a pesquisa e a inspeção veicular. Modelos com alta liquidez são mais fáceis de revender no futuro. Focar em carros com até 5 anos de uso e baixa quilometragem é uma estratégia inteligente para garantir um bom negócio.

Em suma, o mercado de usados em 2026 é um campo fértil para quem está atento às tendências. A valorização é uma realidade, mas a informação e a manutenção são suas melhores ferramentas para navegar neste cenário.`
  },
  {
    id: "3",
    slug: "duelo-gigantes-corolla-cross-vs-renault-boreal",
    title: "Duelo de Gigantes: Toyota Corolla Cross vs. Renault Boreal – Qual o Melhor SUV Médio?",
    excerpt: "O segmento de SUVs médios é um dos mais disputados no Brasil, e em 2026, a briga ganha um novo e emocionante capítulo.",
    category: "Comparativo",
    date: "10 de janeiro de 2026",
    image: blogComparativoSuvs,
    content: `O segmento de SUVs médios é um dos mais disputados no Brasil, e em 2026, a briga ganha um novo e emocionante capítulo. De um lado, o consolidado Toyota Corolla Cross, um ícone de confiabilidade. Do outro, o promissor Renault Boreal, uma aposta tecnológica que promete sacudir o mercado.

## Toyota Corolla Cross 2026

O Toyota Corolla Cross 2026 chega com a força de um nome que é sinônimo de durabilidade e baixo custo de manutenção. A linha 2026 trouxe importantes atualizações em tecnologia e segurança, como a nova central multimídia Toyota Play 2.0 e aprimoramentos nos sistemas de assistência ao motorista. Sua versão híbrida, em particular, é um sucesso de vendas, oferecendo um consumo de combustível exemplar e a tranquilidade de um pós-venda eficiente.

## Renault Boreal

No entanto, o desafio vem da Renault com o lançamento do Boreal. Este SUV é fruto de uma colaboração estratégica e será produzido no Paraná, o que garante um preço competitivo. O Boreal chega com um conjunto mecânico moderno, focado em tecnologia híbrida plug-in (PHEV), que permite rodar trechos significativos apenas com energia elétrica. Seu design arrojado e a promessa de um pacote tecnológico robusto o colocam como um forte rival para o Corolla Cross e outros SUVs chineses que estão chegando ao país.

## Comparativo

| Característica | Toyota Corolla Cross (Híbrido) | Renault Boreal (PHEV) |
|---------------|-------------------------------|----------------------|
| **Tecnologia** | Híbrida tradicional (HEV) | Híbrida Plug-in (PHEV) |
| **Ponto Forte** | Confiabilidade, valor de revenda e baixo consumo. | Tecnologia avançada, autonomia elétrica e design moderno. |
| **Pós-Venda** | Ampla rede e peças acessíveis. | Rede em expansão, potencial de custo de manutenção mais alto. |
| **Público-Alvo** | Quem busca segurança, economia e tradição. | Quem busca inovação, desempenho e está pronto para a eletrificação. |

## Veredito

A escolha entre os dois depende do seu perfil. Se você valoriza a tradição, a confiabilidade e um excelente valor de revenda, o Corolla Cross continua sendo a escolha mais segura. Se, por outro lado, você é um entusiasta da tecnologia, busca a vanguarda da eletrificação e um desempenho mais esportivo, o Renault Boreal é a novidade que merece sua atenção. Ambos são excelentes opções, mas representam filosofias distintas de mobilidade.`
  },
  {
    id: "4",
    slug: "icone-popular-reliquia-evolucao-vw-gol",
    title: "De Ícone Popular a Relíquia: A Evolução do VW Gol e seu Legado no Brasil",
    excerpt: "Poucos carros na história automotiva brasileira carregam tanto significado quanto o Volkswagen Gol. Lançado em 1980, ele não foi apenas um veículo.",
    category: "História",
    date: "08 de janeiro de 2026",
    image: blogHistoriaGol,
    content: `Poucos carros na história automotiva brasileira carregam tanto significado quanto o Volkswagen Gol. Lançado em 1980, ele não foi apenas um veículo; foi um fenômeno cultural e industrial que moldou o mercado e o cotidiano de milhões de brasileiros. Mesmo após o encerramento de sua produção, o Gol permanece vivo, seja nas ruas, seja nas buscas de seminovos em marketplaces.

## O Nascimento de um Ícone

O Gol foi concebido para substituir o Fusca e, desde o início, demonstrou sua vocação para o sucesso. Sua primeira geração, conhecida carinhosamente como "quadrada", marcou época com sua robustez e facilidade de manutenção. Ao longo de suas quatro décadas de história, o Gol passou por diversas transformações, acompanhando a evolução tecnológica mundial e sempre se mantendo como um dos carros mais vendidos do país.

## Os Pilares do Sucesso

O segredo do seu sucesso reside em três pilares: **robustez**, **liquidez** e **adaptabilidade**. O Gol foi o primeiro e único carro produzido no Brasil a atingir a marca de 1 milhão de unidades vendidas, um feito que atesta sua aceitação popular. Sua mecânica simples e confiável, aliada à facilidade de encontrar peças e mão de obra especializada em qualquer canto do país, o transformou em um ativo financeiro.

## O Gol Hoje

Hoje, o Gol é uma relíquia para colecionadores e uma excelente opção para quem busca um carro usado confiável. Modelos das gerações mais recentes, como o Gol G5 e G6, continuam a ter alta liquidez no mercado de seminovos.

## O Legado no Marketplace

A popularidade do Gol se reflete diretamente nos marketplaces de automóveis. Ele é consistentemente um dos modelos mais procurados, e sua presença atrai um público que valoriza a história e a praticidade. Ao listar um Gol, você não está apenas vendendo um carro, mas sim um pedaço da história automotiva nacional.

O Gol é mais do que um carro; é uma lenda que continua a rodar. Sua história de sucesso é um testemunho da engenharia brasileira e da paixão do nosso povo por um veículo que sempre esteve ao seu lado.`
  },
  {
    id: "5",
    slug: "checklist-2026-manutencao-preventiva-carro",
    title: "Checklist 2026: 10 Itens Essenciais para a Manutenção Preventiva do seu Carro",
    excerpt: "A manutenção preventiva é o investimento mais inteligente que você pode fazer no seu veículo. Ela garante segurança e valorização na revenda.",
    category: "Manutenção",
    date: "05 de janeiro de 2026",
    image: blogManutencaoPreventiva,
    content: `A manutenção preventiva é o investimento mais inteligente que você pode fazer no seu veículo. Ela não apenas garante a sua segurança e a longevidade do carro, mas também é um fator crucial para a valorização do veículo na hora da revenda. Em 2026, com a crescente complexidade dos sistemas automotivos, um checklist rigoroso se torna ainda mais vital.

A regra de ouro é: **não espere o problema aparecer**. A manutenção preventiva deve ser feita periodicamente, seguindo o manual do proprietário ou, no mínimo, a cada 10.000 km rodados.

## Os 10 Itens Essenciais do seu Checklist 2026

### 1. Óleo do Motor e Filtros
A troca de óleo e dos filtros (óleo, ar e combustível) é a base da manutenção. Um óleo vencido ou um filtro sujo comprometem a performance e a vida útil do motor.

### 2. Sistema de Freios
Verifique o estado das pastilhas, discos e o nível do fluido de freio. O fluido é higroscópico (absorve umidade) e deve ser trocado no prazo recomendado para evitar falhas no sistema.

### 3. Pneus e Alinhamento
Calibragem correta, verificação do desgaste (Tread Wear Indicator - TWI) e alinhamento/balanceamento são cruciais para a segurança e economia de combustível.

### 4. Sistema de Arrefecimento
Verifique o nível e a qualidade do líquido de arrefecimento (água desmineralizada + aditivo). O superaquecimento é uma das causas mais comuns de danos graves ao motor.

### 5. Bateria e Sistema Elétrico
Com mais eletrônica embarcada, a saúde da bateria é fundamental. Verifique os cabos e o funcionamento de todas as luzes externas e internas.

### 6. Correias e Tensores
A correia dentada (em motores que a utilizam) tem um prazo de troca rigoroso. Seu rompimento pode causar a perda total do motor.

### 7. Suspensão e Amortecedores
Amortecedores e buchas desgastadas comprometem a estabilidade e o conforto.

### 8. Fluido da Transmissão
Em carros automáticos, a troca do fluido da transmissão deve seguir rigorosamente o plano de manutenção do fabricante.

### 9. Limpadores de Para-brisa
Palhetas ressecadas comprometem a visibilidade em dias de chuva, um item de segurança simples e barato de manter.

### 10. Luzes do Painel
Nunca ignore uma luz de advertência acesa. Elas são o primeiro sinal de que algo está errado e buscar o diagnóstico imediato pode evitar reparos caros.

---

Manter um registro de todas as manutenções é a melhor forma de comprovar o cuidado com o veículo, o que se traduz em um preço de revenda mais alto no seu marketplace. Cuide do seu carro hoje para garantir um bom negócio amanhã.`
  }
];

export const getPostBySlug = (slug: string) => {
  return blogPosts.find(post => post.slug === slug);
};

export const getFeaturedPosts = (count: number = 3) => {
  return blogPosts.slice(0, count);
};
