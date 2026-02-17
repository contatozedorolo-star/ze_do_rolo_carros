

## Corrigir botoes "Cadastre-se Agora" e "Como Funciona" no Hero

### Problema
Os dois botoes do Hero da home nao estao redirecionando para suas respectivas paginas (`/auth?mode=signup` e `/how-it-works`).

### Analise
O codigo atual em `src/components/HeroSection.tsx` usa o padrao `Button asChild` com `Link` do React Router. As rotas existem corretamente no `App.tsx`. O problema pode estar na composicao do `asChild` com o componente `Link`, onde em alguns casos o evento de clique nao propaga corretamente.

### Solucao
Trocar os `Link` do React Router por tags `<a>` nativas para esses dois botoes do Hero, garantindo que a navegacao funcione de forma confiavel:

**Arquivo: `src/components/HeroSection.tsx`**

1. Remover o import do `Link` de `react-router-dom`
2. Substituir `<Link to="/auth?mode=signup">` por `<a href="/auth?mode=signup">`
3. Substituir `<Link to="/how-it-works">` por `<a href="/how-it-works">`

### Detalhes tecnicos
- Tags `<a>` nativas com `href` funcionam de forma mais confiavel com o padrao `asChild` do Radix
- A navegacao continuara funcionando normalmente pois o React Router intercepta cliques em links internos via `BrowserRouter`
- Nenhuma outra alteracao necessaria
