
# Plano: Corrigir Configuração do Supabase

## Problema Identificado
O arquivo `.env` está apontando para um projeto Supabase inexistente (`qquumdurizsexbzlxjwz`), quando o projeto real do usuário é `muvornzsnhncihxawntz`.

## Solução

### Passo 1: Corrigir o arquivo `.env`
Atualizar as variáveis de ambiente para apontar ao projeto correto:

```
VITE_SUPABASE_PROJECT_ID="muvornzsnhncihxawntz"
VITE_SUPABASE_PUBLISHABLE_KEY="[anon key do painel]"
VITE_SUPABASE_URL="https://muvornzsnhncihxawntz.supabase.co"
```

### Passo 2: Atualizar o `supabase/config.toml`
O arquivo de configuração também precisa ser atualizado:

```toml
project_id = "muvornzsnhncihxawntz"
```

## Informacao Necessaria
Para completar a correção, preciso da **anon key completa** do seu projeto. Na imagem ela aparece truncada. 

Você pode copiar clicando no botão "Copy" ao lado da chave `anon public` em **API Keys**.

## Resultado Esperado
- App vai conseguir se conectar ao Supabase
- Login, cadastro e listagem de dados vão funcionar
- Erro de DNS vai desaparecer
