

## Criar função `match_documents` para integração com n8n

O n8n utiliza internamente a função `match_documents` para busca vetorial (padrão do nó Supabase Vector Store). Como o projeto já possui a função `match_vehicles`, basta criar uma nova função com o nome e assinatura que o n8n espera.

### O que será feito

Uma migração SQL que:

1. Garante que a extensão `pgvector` está ativa (já está, mas incluímos por segurança).
2. Cria a função `match_documents(query_embedding vector(1536), match_count int, filter jsonb)` que:
   - Busca na tabela `vehicles` apenas registros com `is_active = true`, `is_sold = false` e `embedding IS NOT NULL`.
   - Retorna `id`, `content` (texto com marca, modelo e descrição), `metadata` (JSON com preco, ano, cidade) e `similarity`.
   - Ordena por similaridade de cosseno (usando o operador `<=>`) e limita ao `match_count`.

### Detalhes Técnicos

```text
Assinatura da função:
  match_documents(
    query_embedding vector(1536),
    match_count int DEFAULT 5,
    filter jsonb DEFAULT '{}'
  )
  RETURNS TABLE(id uuid, content text, metadata jsonb, similarity float)

Corpo:
  - content = brand || ' ' || model || ' - ' || COALESCE(description, '')
  - metadata = jsonb com price, year_model, city, state, vehicle_type, km
  - similarity = 1 - (embedding <=> query_embedding)
  - WHERE is_active = true AND is_sold = false AND embedding IS NOT NULL
  - ORDER BY embedding <=> query_embedding
  - LIMIT match_count

Propriedades: STABLE, SECURITY DEFINER, search_path = 'public', 'extensions'
```

Nenhuma alteração no frontend ou em Edge Functions -- apenas a migração SQL.

