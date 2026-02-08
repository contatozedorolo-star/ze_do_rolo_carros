
# Padronizar Email de Contato para contato@zedorolo.com.br

## Problema Identificado
Algumas paginas do site utilizam emails diferentes (como `privacidade@zedorolo.com.br` e `dpo@zedorolo.com.br`) e tambem numeros de telefone fictícios. O unico email de contato valido e: **contato@zedorolo.com.br**.

## Alteracoes Necessarias

### 1. Politica de Privacidade (`src/pages/PoliticaPrivacidade.tsx`)

**Linha 150** - Secao "Seus Direitos":
- De: `privacidade@zedorolo.com.br`
- Para: `contato@zedorolo.com.br`

**Linhas 196-198** - Secao "DPO" (item 13):
- De: `dpo@zedorolo.com.br`
- Para: `contato@zedorolo.com.br`

**Linhas 206-210** - Secao "Contato" (item 14):
- Remover a linha separada de "E-mail privacidade" (`privacidade@zedorolo.com.br`)
- Manter apenas: `contato@zedorolo.com.br`
- Remover o telefone ficticio `(11) 9999-9999`

### 2. Politica de Cookies (`src/pages/PoliticaCookies.tsx`)

**Linha 180** - Secao "Seus Direitos":
- De: `privacidade@zedorolo.com.br`
- Para: `contato@zedorolo.com.br`

**Linhas 199-203** - Secao "Contato" (item 10):
- Remover a linha separada de "E-mail privacidade" (`privacidade@zedorolo.com.br`)
- Manter apenas: `contato@zedorolo.com.br`
- Manter o telefone `(11) 98376-5437` (parece ser real)

### 3. Termos de Uso (`src/pages/TermosDeUso.tsx`)

**Linhas 179-182** - Secao "Contato" (item 11):
- Email ja esta correto (`contato@zedorolo.com.br`)
- Remover o telefone ficticio `(11) 9999-9999`

### 4. Footer (`src/components/Footer.tsx`)
- Ja esta correto com `contato@zedorolo.com.br` -- nenhuma alteracao necessaria.

---

## Resumo das Alteracoes

| Arquivo | Emails Incorretos | Acao |
|---|---|---|
| PoliticaPrivacidade.tsx | `privacidade@zedorolo.com.br`, `dpo@zedorolo.com.br` | Substituir por `contato@zedorolo.com.br` |
| PoliticaCookies.tsx | `privacidade@zedorolo.com.br` | Substituir por `contato@zedorolo.com.br` |
| TermosDeUso.tsx | (email correto, telefone ficticio) | Remover telefone ficticio |

## Detalhes Tecnicos
- Sao alteracoes simples de texto em 3 arquivos `.tsx`
- Nenhuma dependencia ou logica de codigo afetada
- Apenas substituicao de strings estáticas
