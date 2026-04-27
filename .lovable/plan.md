## Ajustes no formulário de veículos

### 1. Renomear labels
- **Modelo** → **Nome/Modelo** (em `AddProduct.tsx` e `EditProduct.tsx`)
- **Versão** mantém apenas "Versão" (já está; remover "(opcional)" no `EditProduct.tsx`)

### 2. Quilometragem — aviso claro
Substituir o texto auxiliar atual por um aviso destacado:
> "Digite o número completo, sem abreviar. Ex: para 318 mil km, digite **318000** (não 318). Se for 0km, deixe em branco ou 0."

Aplicar em `AddProduct.tsx` e `EditProduct.tsx`.

### 3. Preço — aviso claro
Adicionar texto auxiliar logo abaixo do campo Preço:
> "Digite o valor completo. Ex: para R$ 57 mil, digite **57000** (não 57)."

Aplicar em `AddProduct.tsx` e `EditProduct.tsx`.

### 4. Câmbio — apenas Manual e Automático
Em `src/components/filters/FilterData.ts`, reduzir `transmissionTypes` para:
```ts
[{ value: "manual", label: "Manual" }, { value: "automatico", label: "Automático" }]
```
Isso afeta também os filtros (Carros/Caminhões/Vans/Ônibus/Cavalo) — é o comportamento desejado para padronizar.

### 5. Remover "Final da Placa" — TODOS os veículos
- Remover os 3 blocos de "Final da Placa" em `AddProduct.tsx` (linhas ~964-995 do bloco carros, ~1125 caminhões, e onde aparecer em outros tipos).
- Ajustar o grid restante (Blindagem + Cor) para `md:grid-cols-2`.
- Remover `plate_end` do `formData` inicial e do payload de insert.
- Remover também do `EditProduct.tsx` se existir lá.
- (Manter a coluna `plate_end` no banco — apenas parar de gravar/exibir, sem migração.)

### 6. Portas — apenas 2, 3 ou 4
Nos 3 selects de "Portas" em `AddProduct.tsx` (linhas ~999, ~1164, ~1474) e no `EditProduct.tsx` se houver, deixar apenas as opções:
- 2 portas
- 3 portas
- 4 portas

Remover quaisquer outras (5, etc.).

### Arquivos editados
- `src/pages/AddProduct.tsx`
- `src/pages/EditProduct.tsx`
- `src/components/filters/FilterData.ts`
