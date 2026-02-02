
# Plano: Sistema de Moderação Obrigatória para Anúncios e Perfis

## Visão Geral

Implementar um sistema completo de moderação onde:
1. Novos veículos são salvos com status "pendente" e só aparecem publicamente após aprovação
2. Nova página `/admin/notificacoes` centraliza todas as pendências para o administrador
3. Badge de contador no menu admin mostra quantidade de itens aguardando aprovação

---

## Parte 1: Alterações no Banco de Dados

### 1.1 Criar ENUM para status de moderação de veículos

```sql
CREATE TYPE vehicle_moderation_status AS ENUM ('pending', 'approved', 'rejected');
```

### 1.2 Adicionar coluna na tabela `vehicles`

```sql
ALTER TABLE vehicles 
ADD COLUMN moderation_status vehicle_moderation_status DEFAULT 'pending';

-- Aprovar veículos existentes automaticamente
UPDATE vehicles SET moderation_status = 'approved' WHERE moderation_status IS NULL;
```

### 1.3 Atualizar RLS Policy para visualização pública

Alterar a policy "Anyone can view active vehicles" para incluir a condição de moderação:

```sql
-- Apenas veículos aprovados são visíveis publicamente
UPDATE POLICY: is_active = true AND moderation_status = 'approved'
```

---

## Parte 2: Atualizar Fluxo de Cadastro de Veículos

### 2.1 Arquivo: `src/pages/AddProduct.tsx`

Alterar a mensagem de sucesso após cadastro para informar que o anúncio está em análise:

```tsx
toast({ 
  title: "Veículo cadastrado!", 
  description: "Seu anúncio foi enviado para aprovação e estará disponível em breve." 
});
```

O veículo já será salvo com status `pending` por padrão no banco.

---

## Parte 3: Atualizar Hooks de Busca de Veículos

### 3.1 Arquivo: `src/hooks/useVehicles.tsx`

Adicionar filtro para exibir apenas veículos aprovados nas listagens públicas:

```tsx
// Na query principal
.eq("moderation_status", "approved")
```

A RLS já cuidará disso no backend, mas o filtro explícito melhora a clareza.

---

## Parte 4: Criar Página de Notificações Admin

### 4.1 Novo arquivo: `src/pages/AdminNotificacoes.tsx`

Página dividida em duas seções:

**Seção 1: Novos Usuários (KYC Pendente)**
- Lista usuários com `kyc_verifications.status = 'under_review'`
- Botões: "Visualizar Documento", "Aprovar Identidade", "Reprovar"
- Mostrar: nome, documento, data de envio

**Seção 2: Anúncios Pendentes**
- Lista veículos com `moderation_status = 'pending'`
- Mostrar: miniatura, título, preço, nome do vendedor
- Botões: "Aprovar Anúncio", "Reprovar Anúncio"
- Link para visualizar detalhes completos

### 4.2 Funcionalidades da página

```tsx
// Estrutura principal
- Header com estatísticas (cards de contagem)
- Navegação entre abas admin (Notificações, Usuários, KYC, Analytics)
- Tabela de KYC pendentes com ações
- Tabela de veículos pendentes com ações
- Diálogo de confirmação para aprovar/reprovar
```

---

## Parte 5: Adicionar Badge de Pendências no Menu Admin

### 5.1 Arquivo: `src/components/Header.tsx`

Adicionar hook para buscar contagem de pendências e exibir badge:

```tsx
// Novo estado
const [pendingCount, setPendingCount] = useState(0);

// Buscar contagem de KYC + veículos pendentes
useEffect(() => {
  if (isAdmin) {
    fetchPendingCounts();
  }
}, [isAdmin]);

// No link Admin, adicionar badge
<Link to="/admin/notificacoes">
  <Shield className="h-4 w-4" />
  Admin
  {pendingCount > 0 && (
    <Badge className="ml-1 h-5 w-5 rounded-full bg-destructive">
      {pendingCount}
    </Badge>
  )}
</Link>
```

### 5.2 Ícone de sino como alternativa

Se preferir, usar `<Bell />` ao invés de badge numérico no ícone Admin.

---

## Parte 6: Registrar Nova Rota

### 6.1 Arquivo: `src/App.tsx`

```tsx
import AdminNotificacoes from "./pages/AdminNotificacoes";

<Route path="/admin/notificacoes" element={<AdminNotificacoes />} />
```

---

## Parte 7: Atualizar Navegação Admin

### 7.1 Arquivos: `AdminKYC.tsx`, `AdminUsers.tsx`, `AdminAnalytics.tsx`

Adicionar botão "Notificações" na navegação entre páginas admin:

```tsx
<Button variant="outline" asChild>
  <Link to="/admin/notificacoes">
    <Bell className="h-4 w-4 mr-2" />
    Notificações
    {pendingCount > 0 && <Badge>...</Badge>}
  </Link>
</Button>
```

---

## Resumo dos Arquivos

| Arquivo | Ação |
|---------|------|
| `migration.sql` | Criar ENUM e adicionar coluna moderation_status |
| `src/pages/AddProduct.tsx` | Atualizar mensagem de sucesso |
| `src/hooks/useVehicles.tsx` | Adicionar filtro moderation_status = approved |
| `src/pages/AdminNotificacoes.tsx` | **NOVO** - Página de gestão de pendências |
| `src/components/Header.tsx` | Adicionar badge de contagem no menu Admin |
| `src/App.tsx` | Registrar rota /admin/notificacoes |
| `src/pages/AdminKYC.tsx` | Adicionar link para Notificações |
| `src/pages/AdminUsers.tsx` | Adicionar link para Notificações |
| `src/pages/AdminAnalytics.tsx` | Adicionar link para Notificações |

---

## Fluxo de Uso

1. **Usuário cadastra veículo** → Salvo com `moderation_status = 'pending'`
2. **Veículo NÃO aparece** na página pública de veículos
3. **Admin acessa** `/admin/notificacoes` → Vê anúncio na lista de pendentes
4. **Admin clica "Aprovar"** → `moderation_status = 'approved'`
5. **Veículo aparece** publicamente na vitrine

---

## Considerações de Segurança

- Apenas admins podem acessar `/admin/notificacoes`
- Verificação de role feita via `has_role()` no RLS
- Atualização de status de veículos protegida por policy de admin
- Badge de notificações só busca dados se usuário for admin
