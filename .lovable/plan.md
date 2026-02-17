

## Corrigir busca de usuarios e exclusao em cascata no Admin

### Problema 1: Busca nao filtra usuarios

A busca atual tenta encontrar o texto completo digitado dentro do nome do usuario. Porem, o filtro so funciona se o nome completo digitado for uma substring exata do `full_name`. Alem disso, a busca nao inclui o campo `email`.

**Correcao**: Alterar o filtro para dividir a busca em palavras individuais e verificar se TODAS as palavras aparecem nos campos do usuario (nome, email, CPF, cidade, estado). Isso permite buscas parciais mais flexiveis.

### Problema 2: Exclusao nao remove veiculos do banco de dados

A edge function `admin-delete-user` apaga as imagens do storage e exclui o usuario via `auth.admin.deleteUser`, mas nao exclui explicitamente os registros relacionados do banco (veiculos, imagens de veiculos, views, propostas, mensagens, favoritos, KYC). Como a tabela `vehicles` nao possui constraint `ON DELETE CASCADE` vinculada ao `auth.users`, os veiculos ficam orfaos no banco.

**Correcao**: Atualizar a edge function para deletar todos os dados relacionados ao usuario ANTES de excluir o usuario do auth.

---

### Detalhes tecnicos

**Arquivo: `src/pages/AdminUsers.tsx`**

Alterar o `filteredUsers` useMemo para:
- Dividir o `searchQuery` em palavras separadas
- Verificar se cada palavra aparece em pelo menos um dos campos: `full_name`, `email`, `cpf`, `phone`, `city`, `state`
- Todas as palavras devem ter pelo menos um match (busca AND)

```text
Logica:
query = "Bryan Fogaca"
palavras = ["bryan", "fogaca"]

Para cada usuario:
  - "bryan" aparece no nome, email, cpf, cidade ou estado? 
  - "fogaca" aparece no nome, email, cpf, cidade ou estado?
  - Se AMBAS sim -> usuario aparece nos resultados
```

**Arquivo: `supabase/functions/admin-delete-user/index.ts`**

Antes de chamar `auth.admin.deleteUser`, adicionar etapas de limpeza:

1. Buscar todos os IDs de veiculos do usuario
2. Deletar `vehicle_views` dos veiculos do usuario
3. Deletar `vehicle_images` dos veiculos do usuario  
4. Deletar `messages` de propostas onde o usuario e proposer ou seller
5. Deletar `proposals` onde o usuario e proposer ou seller
6. Deletar `favorites` do usuario
7. Deletar `vehicles` do usuario
8. Deletar `kyc_verifications` do usuario
9. Deletar `user_roles` do usuario
10. Deletar `profiles` do usuario
11. Por fim, deletar o usuario do auth

Isso garante que nenhum dado orfao permaneca no banco apos a exclusao.

