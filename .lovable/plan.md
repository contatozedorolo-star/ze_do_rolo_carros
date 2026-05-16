## Reestruturação do cadastro em duas etapas

### Etapa 01 — Cadastro Inicial (Auth.tsx)
Adicionar ao formulário de signup os campos: **CPF, Data de nascimento, CEP, Endereço (rua, número, complemento, bairro), Cidade, Estado**. Manter senha + confirmar senha. Telefone continua como WhatsApp principal.

Após cadastro: usuário cai no dashboard e já pode **enviar propostas livremente** (sem KYC).

### Etapa 02 — KYC disparado pelo Match
- "Match" = vendedor clica em **"Tenho Interesse / Aceitar"** numa proposta recebida → status vira `accepted`.
- A partir desse momento, **ambos** (comprador e vendedor) são obrigados a completar o KYC para liberar o contato.
- Enquanto qualquer um dos dois não concluir o KYC: a tela da proposta exibe banner "Aguardando verificação de identidade" e os dados de contato (WhatsApp/telefone) ficam **ocultos**.
- Após ambos aprovados: contatos liberados na tela da proposta.

### Documentos da Etapa 02
- Selfie do rosto
- Foto do documento (CNH preferida; RG aceito)
- Selfie segurando o documento ao lado do rosto
- Comprovante de residência

---

### Mudanças técnicas

**Banco (migração):**
- `profiles`: adicionar `birth_date date`, `address_street`, `address_number`, `address_complement`, `address_neighborhood` (cep/city/state já existem).
- `kyc_verifications`: adicionar `selfie_with_document_url text`, `residence_proof_url text`. Tornar `document_back_url` opcional (já é).
- `proposals`: adicionar `buyer_kyc_completed boolean default false`, `seller_kyc_completed boolean default false`, `matched_at timestamptz`.
- Atualizar RLS de `proposals` INSERT: remover `has_approved_kyc(auth.uid())` — qualquer autenticado pode propor.
- Atualizar `handle_new_user` para gravar os novos campos do profile vindos do `raw_user_meta_data`.
- Trigger em `proposals` UPDATE: quando `status` muda para `accepted`, gravar `matched_at = now()`.

**Frontend:**
- `Auth.tsx`: adicionar campos novos no signup com validação zod (CPF válido, CEP máscara, data ≥ 18 anos).
- `ProposalDialog.tsx`: remover bloqueio de KYC antes de enviar proposta — só exige login.
- `ProposalsList.tsx`: 
  - Botão "Aceitar" passa a chamar-se **"Tenho Interesse"**.
  - Após aceita, se KYC de qualquer lado estiver incompleto → exibir card "Complete sua verificação para liberar o contato" com CTA para `/profile?kyc=1`.
  - Após ambos KYC aprovados → exibir WhatsApp/telefone clicáveis do outro lado.
- `KYCVerificationForm.tsx`: adicionar 2 novos uploads (selfie+doc, comprovante de residência) e atualizar submit.
- Remover `RestrictedAccessModal` de qualquer página onde ainda dispare por falta de cadastro (já feito).

### Fora do escopo
- Anúncio (criar veículo) continua exigindo apenas login.
- Mensagens/chat entre comprador e vendedor permanecem como hoje.

Posso seguir?