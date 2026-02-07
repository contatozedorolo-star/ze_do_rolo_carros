🚗 Zé do Carros - Marketplace Inteligente de Veículos
⚠️ **Repositório Privado** Propriedade de **BORGES MIDIA NEGOCIOS DIGITAIS LTDA (Alavanca AI)**. O acesso, cópia ou distribuição de qualquer parte do código sem autorização expressa é estritamente proibido.
📋 Sobre o Projeto
O Zé do Carros é uma plataforma de marketplace automotivo de alta tecnologia, desenvolvida para gerenciar a compra, venda e troca de veículos no Brasil com segurança máxima. O sistema utiliza o Consultor Zé IA, uma inteligência artificial que consome um banco de dados RAG (Retrieval-Augmented Generation) para suporte em tempo real.

🚀 Funcionalidades Proprietárias
Consultoria IA com RAG: Chatbot avançado que analisa o estoque em tempo real para responder usuários
Moderação Prévia (Admin): Fluxo de aprovação obrigatória para novos anúncios e verificação de identidade
Sistema de Troca Inteligente: Lógica específica para negociações envolvendo volta em dinheiro e restrições de troca
Verificação de Documentação: Integração de upload de documentos para validação de perfis pelo administrador
🛠️ Stack Tecnológica
Frontend: React + Vite (Customizado via Lovable)
Backend: Supabase (PostgreSQL) com políticas de Row Level Security (RLS) granulares
Integrações de Voz: ElevenLabs para respostas de áudio da IA
Infraestrutura: Google Cloud Platform (Auth, Analytics Data API e Cloud Storage)

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

🔒 Segurança e Compliance
Este projeto passa por auditorias regulares de segurança via Antigravity para assegurar que:

Nenhuma chave de API ou segredo esteja exposto no código fonte
Os dados de identidade dos usuários (Storage) estejam protegidos contra acesso público
As URLs de redirecionamento de autenticação estejam restritas aos domínios autorizados
💡 Dica Importante
Como o repositório é privado, certifique-se de configurar as suas Actions no GitHub para usar apenas segredos armazenados nas configurações do repositório (`Settings > Secrets and variables > Actions`), mantendo suas chaves de produção 100% protegidas.
⭐ Mantido exclusivamente por Fernando Borges / Alavanca AI
Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
