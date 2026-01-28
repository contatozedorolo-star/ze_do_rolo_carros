
# Plano: Restaurar Imagem de Fundo na Hero Section

## Objetivo
Adicionar a imagem do Range Rover (que você enviou) como background da Hero Section na página inicial, substituindo ou complementando o fundo animado atual.

---

## O que será feito

### 1. Salvar a imagem no projeto
- Copiar a imagem que você enviou para a pasta `src/assets/`
- Nome sugerido: `hero-background.jpg`

### 2. Modificar o HeroSection.tsx
- Importar a nova imagem de fundo
- Adicionar a imagem como background absoluto atrás do conteúdo
- Aplicar um overlay escuro semi-transparente para garantir boa legibilidade do texto
- Manter o efeito `BeamsBackground` por cima para combinar os dois visuais (ou remover se preferir apenas a foto)

---

## Resultado Visual Esperado

A Hero Section terá:
- **Fundo**: Imagem do Range Rover na Faria Lima Plaza
- **Overlay**: Camada escura semi-transparente para contraste
- **Texto**: Todo o conteúdo atual (título, subtítulo, botões) visível com boa legibilidade
- **Wave Divider**: Mantido na parte inferior

---

## Detalhes Técnicos

**Arquivo modificado:** `src/components/HeroSection.tsx`

**Mudanças no código:**
```tsx
// Adicionar import da imagem
import heroBackground from "@/assets/hero-background.jpg";

// Adicionar dentro da section, antes do conteúdo:
<div 
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: `url(${heroBackground})` }}
/>
<div className="absolute inset-0 bg-primary/70" /> {/* Overlay escuro */}
```

---

## Arquivos Envolvidos
1. **Novo arquivo**: `src/assets/hero-background.jpg` (imagem que você enviou)
2. **Modificação**: `src/components/HeroSection.tsx`
