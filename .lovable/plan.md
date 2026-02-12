

# Implementacao de Busca Vetorial (Semantic Search) para o Ze do Rolo

## Resumo

Implementar busca semantica de veiculos usando pgvector no Supabase, permitindo que a IA encontre veiculos por intencao e contexto (ex: "quero um carro economico para familia") em vez de apenas filtros exatos.

## Pre-requisito: Chave da OpenAI

A geracao de embeddings requer o modelo `text-embedding-3-small` da OpenAI. Sera necessario adicionar o secret `OPENAI_API_KEY` nas configuracoes do Supabase antes de testar.

---

## Passo 1: Migracoes no Banco de Dados

Executar uma migracao SQL que:

1. Habilita a extensao `vector` (pgvector)
2. Adiciona coluna `embedding` do tipo `vector(1536)` na tabela `vehicles`
3. Cria indice HNSW para buscas rapidas:
   ```sql
   CREATE INDEX ON vehicles USING hnsw (embedding vector_cosine_ops);
   ```
4. Cria funcao SQL `match_vehicles` que:
   - Recebe um vetor de consulta e quantidade de resultados
   - Filtra apenas `is_active = true AND is_sold = false`
   - Ordena por similaridade de cosseno
   - Retorna id, title, brand, model, year_model, price, city, state, description e score de similaridade

---

## Passo 2: Edge Function `generate-vehicle-embedding`

Cria uma Edge Function que:

- Recebe `vehicle_id` no body
- Busca os dados do veiculo no Supabase (marca, modelo, ano, preco, descricao, opcionais, cidade/estado, tipo de carroceria, combustivel, transmissao, km)
- Concatena tudo em um texto descritivo unico
- Chama a API da OpenAI (`text-embedding-3-small`) para gerar o vetor
- Atualiza a coluna `embedding` do veiculo no banco

---

## Passo 3: Trigger de Automacao

Cria um Database Trigger que dispara a Edge Function automaticamente:

- Funcao PL/pgSQL `trigger_generate_embedding()` que usa `pg_net` para chamar a Edge Function `generate-vehicle-embedding` via HTTP POST
- Trigger `on_vehicle_upsert_generate_embedding` que dispara em `INSERT` ou `UPDATE` na tabela `vehicles` (quando campos relevantes mudam)

---

## Passo 4: Edge Function `search-vehicles-semantic`

Cria uma Edge Function que:

- Recebe a `query` (pergunta do usuario) no body
- Gera o embedding da pergunta via OpenAI
- Chama a funcao SQL `match_vehicles` com o vetor gerado
- Retorna os Top 5 veiculos com:
  - Titulo, preco formatado, link direto (`/veiculo/{id}`)
  - Marca, modelo, ano, cidade/estado
  - Score de similaridade
- Endpoint pronto para ser chamado via n8n (HTTP Request) ou diretamente

---

## Passo 5: Configuracao

- Adicionar secret `OPENAI_API_KEY` no Supabase
- Registrar ambas as funcoes no `supabase/config.toml` com `verify_jwt = false` (para acesso via n8n)

---

## Detalhes Tecnicos

### Texto para Embedding (exemplo de concatenacao)
```
Chevrolet S10 LTZ 2023. Pickup. Diesel. Automatico. 45000 km.
Preco: R$ 189.000. Cor: Prata. Cidade: Apucarana/PR.
Opcionais: Ar condicionado, Direcao eletrica, Airbag.
Descricao: Veiculo em otimo estado...
```

### Funcao SQL `match_vehicles`
```sql
CREATE FUNCTION match_vehicles(
  query_embedding vector(1536),
  match_count int DEFAULT 5
) RETURNS TABLE(...)
AS $$
  SELECT id, title, brand, model, year_model, price, city, state, description,
         1 - (embedding <=> query_embedding) AS similarity
  FROM vehicles
  WHERE is_active = true AND is_sold = false AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$
```

### Fluxo de Dados

```text
Veiculo Criado/Atualizado
  -> Trigger PL/pgSQL
    -> pg_net HTTP POST
      -> Edge Function generate-vehicle-embedding
        -> OpenAI text-embedding-3-small
          -> Salva vetor na coluna embedding

Pergunta do Usuario (n8n ou site)
  -> Edge Function search-vehicles-semantic
    -> OpenAI text-embedding-3-small (embedding da pergunta)
      -> match_vehicles (busca por cosseno)
        -> Top 5 veiculos retornados
```

### Arquivos a Criar/Modificar
- `supabase/migrations/xxx.sql` -- pgvector, coluna, indice, funcao, trigger
- `supabase/functions/generate-vehicle-embedding/index.ts` -- gera embedding do veiculo
- `supabase/functions/search-vehicles-semantic/index.ts` -- busca semantica
- `supabase/config.toml` -- registrar novas funcoes

