

## Corrigir erro "null value in column url" ao enviar documentos KYC

### Problema
Ao submeter documentos para verificacao, o erro ocorre:
`null value in column "url" of relation "http_request_queue" violates not-null constraint`

### Causa raiz
Existem **dois triggers** que disparam quando o status muda para `under_review`:

1. `on_kyc_status_under_review` -> chama `handle_kyc_under_review()` (URL hardcoded - funciona)
2. `on_kyc_under_review_send_email` -> chama `notify_document_under_review()` (usa `current_setting('app.settings.supabase_url')` que retorna NULL)

O trigger `notify_document_under_review()` tenta construir a URL com `supabase_url || '/functions/v1/send-document-status-email'`, mas como `app.settings.supabase_url` nao esta configurado no banco, a URL fica NULL e causa o erro.

Alem disso, os dois triggers fazem a mesma coisa (enviar email de status), entao ha duplicidade.

### Solucao
Remover o trigger duplicado `on_kyc_under_review_send_email` que usa a funcao com URL nula. O trigger `on_kyc_status_under_review` (que usa `handle_kyc_under_review` com URL hardcoded) ja cobre essa funcionalidade.

### Detalhes tecnicos

**Migration SQL:**

```sql
-- Remover o trigger duplicado que causa o erro de URL nula
DROP TRIGGER IF EXISTS on_kyc_under_review_send_email ON public.kyc_verifications;

-- Opcional: remover a funcao orfao tambem
DROP FUNCTION IF EXISTS public.notify_document_under_review();
```

Isso resolve o erro imediatamente sem alterar nenhum codigo frontend.

