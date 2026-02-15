

## Plano: Migrar dominio de zedorolo.lovable.app para zedorolo.com

### Resumo

O dominio antigo `zedorolo.lovable.app` aparece em 3 lugares que precisam ser corrigidos. Nao existe coluna de URL na tabela `vehicles` - a URL e gerada dinamicamente na funcao SQL `match_documents`, entao nao ha dados para atualizar.

Alem disso, ha um erro de build nao relacionado (import do Resend no Deno) que sera corrigido junto.

### O que sera feito

**1. Corrigir a funcao SQL `match_documents`**
- Atualizar o dominio hardcoded de `zedorolo.lovable.app` para `zedorolo.com` na geracao da URL do veiculo
- Migrar via SQL migration

**2. Criar Trigger de seguranca (BEFORE INSERT/UPDATE)**
- Nao se aplica diretamente porque nao existe coluna `url` na tabela `vehicles`
- Em vez disso, a URL e construida dinamicamente na funcao `match_documents`
- A abordagem mais segura e centralizar o dominio apenas na funcao SQL, garantindo que qualquer mudanca futura precise alterar apenas um lugar

**3. Corrigir Edge Functions com dominio antigo**
- `supabase/functions/send-ad-rejected-email/index.ts` - trocar link do perfil de `zedorolo.lovable.app` para `zedorolo.com`
- `supabase/functions/send-document-rejected-email/index.ts` - trocar link de reenvio de `zedorolo.lovable.app` para `zedorolo.com`

**4. Corrigir erro de build (Resend import)**
- Atualizar o import do Resend em todas as edge functions de `npm:resend@2.0.0` para `npm:resend@^4.0.0` (versao compativel com Deno)

### Detalhes tecnicos

```text
Arquivos a modificar:
+-- SQL Migration (nova)
|   +-- Recriar match_documents com dominio zedorolo.com
|
+-- supabase/functions/send-ad-rejected-email/index.ts
|   +-- Trocar URL do perfil
|   +-- Atualizar import Resend
|
+-- supabase/functions/send-document-rejected-email/index.ts
    +-- Trocar URL de reenvio
    +-- Atualizar import Resend
```

**Nota sobre Trigger:** Como a tabela `vehicles` nao armazena URLs (sao geradas dinamicamente), criar um trigger nao e necessario. O ponto unico de controle e a funcao `match_documents`.

