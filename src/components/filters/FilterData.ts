// Dados estáticos para os filtros

export const brands = {
  carro: ["Chevrolet", "Fiat", "Ford", "Honda", "Hyundai", "Toyota", "Volkswagen", "Jeep", "Nissan", "Renault", "BMW", "Mercedes-Benz", "Audi", "Mitsubishi", "Peugeot", "Citroën", "Kia", "JAC", "Caoa Chery", "BYD"],
  moto: ["Honda", "Yamaha", "Suzuki", "Kawasaki", "BMW", "Harley-Davidson", "Ducati", "Triumph", "KTM", "Royal Enfield", "Dafra", "Shineray", "Haojue"],
  caminhao: ["Mercedes-Benz", "Volvo", "Scania", "DAF", "Iveco", "MAN", "Ford", "Volkswagen"],
  van: ["Fiat", "Mercedes-Benz", "Renault", "Peugeot", "Citroën", "Iveco", "Hyundai"],
  camionete: ["Toyota", "Chevrolet", "Ford", "Volkswagen", "Mitsubishi", "Nissan", "Fiat", "RAM"],
  cavalo: ["Scania", "Volvo", "Mercedes-Benz", "DAF", "Iveco", "MAN", "Volkswagen"],
  trator: ["John Deere", "Case IH", "New Holland", "Massey Ferguson", "Valtra", "Agrale", "LS Tractor", "Yanmar", "Mahindra"],
  implemento: ["Randon", "Guerra", "Noma", "Librelato", "Facchini", "Rossetti", "Rodofort", "Krone", "Stara"],
};

export const colorOptions = [
  "Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul", "Verde", 
  "Amarelo", "Laranja", "Marrom", "Bege", "Dourado", "Vinho", "Rosa", "Outro"
];

export const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() + 1 - i).toString());

export const plateEndings = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Filtros específicos para CARROS
export const carBodyTypes = [
  { value: "suv", label: "SUV" },
  { value: "sedan", label: "Sedã" },
  { value: "hatch", label: "Hatch" },
  { value: "pickup", label: "Picape" },
  { value: "coupe", label: "Cupê" },
  { value: "conversivel", label: "Conversível" },
  { value: "wagon", label: "Perua/Wagon" },
  { value: "minivan", label: "Minivan" },
];

export const carNeedTypes = [
  { value: "pcd", label: "PCD" },
  { value: "familia", label: "Família" },
  { value: "luxo", label: "Luxo" },
  { value: "economico", label: "Econômico" },
  { value: "esportivo", label: "Esportivo" },
  { value: "trabalho", label: "Trabalho" },
  { value: "off-road", label: "Off-Road" },
];

export const transmissionTypes = [
  { value: "manual", label: "Manual" },
  { value: "automatico", label: "Automático" },
  { value: "cvt", label: "CVT" },
  { value: "semi-automatico", label: "Semi-Automático" },
];

export const fuelTypes = [
  { value: "flex", label: "Flex" },
  { value: "gasolina", label: "Gasolina" },
  { value: "etanol", label: "Etanol" },
  { value: "diesel", label: "Diesel" },
  { value: "eletrico", label: "Elétrico" },
  { value: "hibrido", label: "Híbrido" },
  { value: "hibrido_plugin", label: "Híbrido Plug-in" },
  { value: "gnv", label: "GNV" },
];

// Filtros específicos para MOTOS
export const motoStyles = [
  { value: "custom", label: "Custom" },
  { value: "esportiva", label: "Esportiva" },
  { value: "naked", label: "Naked" },
  { value: "scooter", label: "Scooter" },
  { value: "trail", label: "Trail/Enduro" },
  { value: "touring", label: "Touring" },
  { value: "street", label: "Street" },
  { value: "cross", label: "Cross/Motocross" },
];

export const motoStartTypes = [
  { value: "eletrica", label: "Elétrica" },
  { value: "pedal", label: "Pedal" },
  { value: "ambos", label: "Elétrica + Pedal" },
];

export const motoMotorTypes = [
  { value: "2t", label: "2 Tempos" },
  { value: "4t", label: "4 Tempos" },
  { value: "eletrico", label: "Elétrico" },
];

export const motoBrakeTypes = [
  { value: "disco", label: "Disco" },
  { value: "tambor", label: "Tambor" },
  { value: "disco_dianteiro", label: "Disco/Tambor" },
  { value: "abs", label: "ABS" },
  { value: "cbs", label: "CBS" },
];

export const motoOptionals = [
  { value: "abs", label: "ABS" },
  { value: "alarme", label: "Alarme" },
  { value: "bau", label: "Baú" },
  { value: "gps", label: "GPS" },
  { value: "bluetooth", label: "Bluetooth" },
  { value: "aquecimento_punho", label: "Aquecimento no Punho" },
];

export const cylinderRanges = [
  { value: "50", label: "Até 50cc" },
  { value: "125", label: "Até 125cc" },
  { value: "250", label: "126cc - 250cc" },
  { value: "500", label: "251cc - 500cc" },
  { value: "750", label: "501cc - 750cc" },
  { value: "1000", label: "751cc - 1000cc" },
  { value: "1000+", label: "Acima de 1000cc" },
];

// Filtros específicos para CAMINHÕES
export const truckTypes = [
  { value: "3_4", label: "3/4" },
  { value: "toco", label: "Toco" },
  { value: "truck", label: "Truck" },
  { value: "bitruck", label: "Bitruck" },
  { value: "cavalo_mecanico", label: "Cavalo Mecânico" },
  { value: "vuc", label: "VUC" },
];

export const truckTractions = [
  { value: "4x2", label: "4x2" },
  { value: "6x2", label: "6x2" },
  { value: "6x4", label: "6x4" },
  { value: "8x2", label: "8x2" },
  { value: "8x4", label: "8x4" },
];

export const truckBodies = [
  { value: "bau", label: "Baú" },
  { value: "bau_refrigerado", label: "Baú Refrigerado" },
  { value: "graneleiro", label: "Graneleiro" },
  { value: "cacamba", label: "Caçamba" },
  { value: "carroceria", label: "Carroceria" },
  { value: "munck", label: "Munck" },
  { value: "tanque", label: "Tanque" },
  { value: "plataforma", label: "Plataforma" },
  { value: "sider", label: "Sider" },
];

export const truckCabins = [
  { value: "simples", label: "Simples" },
  { value: "leito", label: "Leito" },
  { value: "dupla", label: "Cabine Dupla" },
];

// Filtros específicos para VANS
export const vanSubcategories = [
  { value: "passageiro", label: "Passageiro" },
  { value: "furgao", label: "Furgão" },
  { value: "carroceria", label: "Carroceria" },
  { value: "mista", label: "Mista" },
];

// Filtros específicos para CAVALOS MECÂNICOS
export const cavaloTractions = [
  { value: "4x2", label: "4x2" },
  { value: "6x2", label: "6x2" },
  { value: "6x4", label: "6x4" },
  { value: "8x4", label: "8x4" },
];

export const cavaloCabins = [
  { value: "simples", label: "Cabine Simples" },
  { value: "leito", label: "Cabine Leito" },
  { value: "leito_alto", label: "Leito Alto" },
];

export const cavaloPotencias = [
  { value: "300-400", label: "300-400 CV" },
  { value: "400-500", label: "400-500 CV" },
  { value: "500-600", label: "500-600 CV" },
  { value: "600+", label: "Acima de 600 CV" },
];

// Filtros específicos para TRATORES E MÁQUINAS
export const tratorTypes = [
  { value: "trator_agricola", label: "Trator Agrícola" },
  { value: "trator_esteira", label: "Trator de Esteira" },
  { value: "retroescavadeira", label: "Retroescavadeira" },
  { value: "escavadeira", label: "Escavadeira" },
  { value: "colheitadeira", label: "Colheitadeira" },
  { value: "pulverizador", label: "Pulverizador" },
  { value: "plantadeira", label: "Plantadeira" },
];

export const tratorTractions = [
  { value: "4x2", label: "4x2 (Simples)" },
  { value: "4x4", label: "4x4 (TDA)" },
  { value: "esteira", label: "Esteira" },
];

export const tratorPotencias = [
  { value: "0-50", label: "Até 50 CV" },
  { value: "50-100", label: "50-100 CV" },
  { value: "100-150", label: "100-150 CV" },
  { value: "150-200", label: "150-200 CV" },
  { value: "200-300", label: "200-300 CV" },
  { value: "300+", label: "Acima de 300 CV" },
];

export const horasUsoRanges = [
  { value: "0-1000", label: "Até 1.000h" },
  { value: "1000-3000", label: "1.000 - 3.000h" },
  { value: "3000-5000", label: "3.000 - 5.000h" },
  { value: "5000-8000", label: "5.000 - 8.000h" },
  { value: "8000-12000", label: "8.000 - 12.000h" },
  { value: "12000+", label: "Acima de 12.000h" },
];

// Filtros específicos para IMPLEMENTOS
export const implementoTypes = [
  { value: "graneleiro", label: "Graneleiro" },
  { value: "sider", label: "Sider" },
  { value: "bau", label: "Baú" },
  { value: "bau_refrigerado", label: "Baú Refrigerado" },
  { value: "prancha", label: "Prancha" },
  { value: "tanque", label: "Tanque" },
  { value: "cacamba", label: "Caçamba" },
  { value: "cegonheira", label: "Cegonheira" },
  { value: "porta_container", label: "Porta-Container" },
  { value: "dolly", label: "Dolly" },
];

export const implementoEixos = [
  { value: "1", label: "1 Eixo" },
  { value: "2", label: "2 Eixos" },
  { value: "3", label: "3 Eixos" },
  { value: "4", label: "4 Eixos" },
  { value: "5+", label: "5+ Eixos" },
];

export const implementoComprimentos = [
  { value: "6-8", label: "6-8 metros" },
  { value: "8-10", label: "8-10 metros" },
  { value: "10-12", label: "10-12 metros" },
  { value: "12-14", label: "12-14 metros" },
  { value: "14+", label: "Acima de 14 metros" },
];

// Estados brasileiros
export const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

// Opções de ordenação
export const sortOptions = [
  { value: "relevance", label: "Mais relevantes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "km_asc", label: "Menor quilometragem" },
  { value: "hours_asc", label: "Menos horas de uso" },
  { value: "year_desc", label: "Ano mais novo" },
  { value: "created_desc", label: "Mais recente" },
  { value: "location", label: "Localização próxima" },
];
