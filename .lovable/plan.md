

## Corrigir os botoes da pagina de veiculo

O problema: o link do WhatsApp foi colocado no botao errado. Precisa trocar:

- **"FAZER PROPOSTA DE TROCA"** -- deve voltar a abrir o `ProposalDialog` (como era antes)
- **"FALAR COM CONSULTOR ZE"** -- deve redirecionar para o WhatsApp

### Alteracoes no arquivo `src/pages/ProductDetail.tsx`

**1. Restaurar o botao "FAZER PROPOSTA DE TROCA"**

Remover o `<a>` com link do WhatsApp que envolve o botao e restaurar o `ProposalDialog` como trigger, usando o componente que ja existe e esta importado no arquivo.

```tsx
<ProposalDialog
  vehicleId={vehicle.id}
  vehicleTitle={vehicle.title}
  vehiclePrice={vehicle.price}
  sellerId={vehicle.user_id}
  acceptsTrade={vehicle.accepts_trade || false}
  trigger={
    <Button className="w-full bg-[#FF8C36] hover:bg-[#e67d2e] text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all">
      <ArrowLeftRight className="h-5 w-5 mr-2" />
      FAZER PROPOSTA DE TROCA
    </Button>
  }
/>
```

**2. Mover o link do WhatsApp para o botao "FALAR COM CONSULTOR ZE"**

Envolver o botao "FALAR COM CONSULTOR ZE" com o `<a>` do WhatsApp, com mensagem pre-preenchida contendo titulo, preco e URL do veiculo.

```tsx
<a
  href={`https://wa.me/5543991972445?text=${encodeURIComponent(
    `Olá! Tenho interesse no veículo: ${vehicle.title} (R$ ${vehicle.price.toLocaleString('pt-BR')}) - ${window.location.href}`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="block"
>
  <Button variant="outline" className="w-full border-2 border-[#142562] text-[#142562] hover:bg-[#142562] hover:text-white font-bold py-6 text-lg transition-all">
    <MessageCircle className="h-5 w-5 mr-2" />
    FALAR COM CONSULTOR ZE
  </Button>
</a>
```

### Resumo

Apenas um arquivo sera alterado (`ProductDetail.tsx`), trocando a funcionalidade entre os dois botoes. Nenhum componente novo precisa ser criado -- o `ProposalDialog` ja existe e esta importado.
