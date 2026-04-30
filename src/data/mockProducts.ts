// Veículos de demonstração removidos do site.
// Mantemos os exports como arrays vazios para preservar a compatibilidade
// com componentes que ainda os importam (Index, Veiculos, SearchResults, ProductDetail).

type MockVehicle = {
  id: string;
  image: string;
  title: string;
  price: number;
  location: string;
  year: string;
  mileage: number;
  transmission: string;
  fuel: string;
  sellerLevel: "bronze" | "prata" | "ouro";
  verified: boolean;
  certified?: boolean;
  acceptsTrade?: boolean;
  motorScore?: number;
  paintOriginal?: boolean;
  type: string;
};

export const vehicles: MockVehicle[] = [];
export const featuredVehicles: MockVehicle[] = [];
export const zeFindsVehicles: MockVehicle[] = [];
export const tradeVehicles: MockVehicle[] = [];
export const heavyVehicles: MockVehicle[] = [];

export const getVehiclesByCategory = (_category: string): MockVehicle[] => {
  return [];
};
