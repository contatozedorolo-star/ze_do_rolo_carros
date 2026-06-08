## Alterações

### 1. Menu "Veículos" abre direto a página (sem login)
Em `src/components/Header.tsx` (linha 56), remover o `protected: true` do item Veículos:
```ts
{ href: "/veiculos", label: "Veículos" },
```
Isso elimina o redirecionamento para `/auth` no clique (desktop e mobile), o cadeado ao lado do label e leva o usuário direto para `/veiculos`. A página `/veiculos` já está aberta (modal restrito já desativado — `showRestrictedModal = false`).

Manter `Zé IA` como protegido (continua exigindo login — apenas a página dele é acessível ao logar, conforme já decidido).

### 2. Redes sociais no rodapé
Em `src/components/Footer.tsx`:
- Remover o ícone/link do TikTok e o componente `TikTokIcon`.
- Atualizar os links:
  - Instagram → `https://www.instagram.com/zedorolo.oficial`
  - Facebook → `https://www.facebook.com/share/1HN8cjymq1/`

### Sobre o cadastro em 2 etapas
Já está implementado conforme a especificação (Etapa 01 em `/auth` com nome, e-mail, telefone/WhatsApp, CPF, nascimento e endereço com CEP; Etapa 02 KYC com selfie, documento, selfie com documento e comprovante de residência, acionada após o match). Sem mudanças necessárias aqui — me avise se quiser ajustar algum campo específico.

## Fora do escopo
Nenhuma alteração de backend, rotas ou fluxo de proposta.
