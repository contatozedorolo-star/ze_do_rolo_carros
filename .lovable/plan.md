
# Plano: Efeito Parallax na Hero Section

## Objetivo
Aplicar um efeito de background fixo (parallax) na Hero Section onde a imagem fica estática e o conteúdo desliza por cima dela durante o scroll.

---

## O que será feito

### 1. Modificar a estrutura da Hero Section
A implementação atual usa um `div` absoluto para o background. Para o efeito parallax funcionar corretamente, precisamos:

- Aplicar `background-attachment: fixed` diretamente na section
- Usar `background-size: cover` e `background-position: center`
- Criar um overlay com gradiente (preto transparente → preto sólido)

### 2. Garantir que seções seguintes "cubram" o background
- Adicionar `position: relative` e `z-index` adequado nas seções abaixo
- Adicionar `background-color` sólida nas seções seguintes para "cobrir" a imagem ao scrollar

---

## Mudanças Técnicas

### Arquivo: `src/components/HeroSection.tsx`

**De:**
```tsx
<section className="relative overflow-hidden">
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${heroBackground})` }}
  />
  <div className="absolute inset-0 bg-primary/70" />
```

**Para:**
```tsx
<section 
  className="relative overflow-hidden"
  style={{ 
    backgroundImage: `url(${heroBackground})`,
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat'
  }}
>
  {/* Overlay Gradiente: preto transparente → preto semi-sólido */}
  <div 
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)'
    }}
  />
```

### Arquivo: `src/pages/Index.tsx`

Adicionar classes para garantir que as seções seguintes cubram a Hero:

```tsx
<div className="container relative z-10 bg-background">
```

---

## Resultado Visual Esperado

1. **Imagem Fixa**: O Range Rover permanece estático enquanto você faz scroll
2. **Conteúdo Deslizante**: Texto e botões sobem/descem normalmente
3. **Overlay Gradiente**: Transição suave de preto transparente (topo) para preto mais sólido (base)
4. **Efeito de Revelação**: Ao scrollar para baixo, as seções de veículos "cobrem" a imagem de fundo
5. **Carro Centralizado**: `background-position: center center` garante que o carro não seja cortado

---

## Observação sobre Mobile

O `background-attachment: fixed` pode ter comportamento diferente em alguns dispositivos móveis (iOS especialmente). Se necessário, podemos adicionar uma media query para desativar o parallax em mobile:

```css
@media (max-width: 768px) {
  background-attachment: scroll;
}
```

---

## Arquivos Envolvidos
1. `src/components/HeroSection.tsx` - Aplicar parallax e overlay gradiente
2. `src/pages/Index.tsx` - Garantir z-index e background nas seções seguintes
