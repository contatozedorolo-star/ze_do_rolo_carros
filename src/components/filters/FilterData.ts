// Dados estáticos para os filtros

export const brands = {
  carro: ["Chevrolet", "Fiat", "Ford", "Honda", "Hyundai", "Toyota", "Volkswagen", "Jeep", "Nissan", "Renault", "BMW", "Mercedes-Benz", "Audi", "Mitsubishi", "Peugeot", "Citroën", "Kia", "JAC", "Caoa Chery", "BYD", "Volvo", "Land Rover", "Porsche", "Ferrari", "Lamborghini", "Maserati", "Alfa Romeo", "Mini", "Subaru", "Suzuki", "Troller", "RAM"],
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

// Motor em Litros
export const engineLiters = [
  { value: "1.0", label: "1.0" },
  { value: "1.2", label: "1.2" },
  { value: "1.3", label: "1.3" },
  { value: "1.4", label: "1.4" },
  { value: "1.5", label: "1.5" },
  { value: "1.6", label: "1.6" },
  { value: "1.8", label: "1.8" },
  { value: "2.0", label: "2.0" },
  { value: "2.2", label: "2.2" },
  { value: "2.4", label: "2.4" },
  { value: "2.5", label: "2.5" },
  { value: "3.0", label: "3.0" },
  { value: "3.5", label: "3.5" },
  { value: "4.0", label: "4.0" },
  { value: "5.0", label: "5.0+" },
];

// Portas
export const doorOptions = [
  { value: "2", label: "2 portas" },
  { value: "3", label: "3 portas" },
  { value: "4", label: "4 portas" },
  { value: "5", label: "5 portas" },
];

// Lugares
export const seatOptions = [
  { value: "2", label: "2 lugares" },
  { value: "4", label: "4 lugares" },
  { value: "5", label: "5 lugares" },
  { value: "7", label: "7 lugares" },
  { value: "8", label: "8+ lugares" },
];

// Filtros específicos para CARROS
export const carBodyTypes = [
  { value: "buggy", label: "Buggy" },
  { value: "conversivel", label: "Conversível" },
  { value: "coupe", label: "Cupê" },
  { value: "hatch", label: "Hatch" },
  { value: "minivan", label: "Minivan" },
  { value: "perua", label: "Perua" },
  { value: "pickup", label: "Picape" },
  { value: "sedan", label: "Sedã" },
  { value: "suv", label: "SUV" },
  { value: "van", label: "Van" },
];

export const carNeedTypes = [
  { value: "pcd", label: "PCD" },
  { value: "familia", label: "Família" },
  { value: "luxo", label: "Luxo" },
  { value: "economico", label: "Econômico" },
  { value: "esportivo", label: "Esportivo" },
  { value: "trabalho", label: "Trabalho" },
  { value: "off-road", label: "Off-Road" },
  { value: "uber", label: "Uber/App" },
  { value: "primeiro_carro", label: "Primeiro Carro" },
];

// Motivos de Leilão
export const auctionReasons = [
  { value: "financeira", label: "Financeira" },
  { value: "roubo_recuperado", label: "Roubo/Furto Recuperado" },
  { value: "sinistro", label: "Sinistro/Batida" },
  { value: "apreensao", label: "Apreensão" },
  { value: "frota", label: "Renovação de Frota" },
  { value: "outros", label: "Outros" },
];

// Opções de Seguro
export const insuranceOptions = [
  { value: "sim", label: "Sim, cobre 100%" },
  { value: "nao", label: "Não cobre 100%" },
  { value: "nao_sei", label: "Não sei informar" },
];

// Prioridade de Negócio
export const tradePriorityOptions = [
  { value: "dinheiro", label: "Prefiro dinheiro" },
  { value: "troca", label: "Prefiro troca" },
  { value: "indiferente", label: "Tanto faz" },
];

// Faixas de Nota para Filtro
export const ratingRanges = [
  { value: "8-10", label: "Excelente (8-10)" },
  { value: "6-7", label: "Bom (6-7)" },
  { value: "4-5", label: "Regular (4-5)" },
  { value: "0-3", label: "Precisa de reparos (0-3)" },
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
  { value: "ciclomotor", label: "Ciclomotor" },
  { value: "custom", label: "Custom" },
  { value: "eletrica", label: "Elétrica" },
  { value: "esportiva", label: "Esportiva" },
  { value: "naked", label: "Naked" },
  { value: "cross", label: "Cross/Off-Road" },
  { value: "quadriciclo", label: "Quadriciclo" },
  { value: "scooter", label: "Scooter" },
  { value: "street", label: "Street" },
  { value: "supermotard", label: "Supermotard" },
  { value: "touring", label: "Touring" },
  { value: "big_trail", label: "Big Trail/Adventure" },
  { value: "trial", label: "Trial" },
  { value: "triciclo", label: "Triciclo" },
  { value: "utilitaria", label: "Utilitária" },
];

export const motoStartTypes = [
  { value: "eletrica", label: "Partida Elétrica" },
  { value: "pedal", label: "Pedal (Kick)" },
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

export const motoFuelSystems = [
  { value: "carburador", label: "Carburador" },
  { value: "injecao", label: "Injeção Eletrônica" },
];

export const motoOptionals = [
  { value: "abs", label: "ABS" },
  { value: "alarme", label: "Alarme" },
  { value: "amortecedor_direcao", label: "Amortecedor de Direção" },
  { value: "bau", label: "Baú" },
  { value: "computador_bordo", label: "Computador de Bordo" },
  { value: "escapamento_esportivo", label: "Escapamento Esportivo" },
  { value: "gps", label: "GPS" },
  { value: "bluetooth", label: "Bluetooth" },
  { value: "aquecimento_punho", label: "Aquecimento no Punho" },
  { value: "protetor_motor", label: "Protetor de Motor" },
  { value: "protetor_mao", label: "Protetor de Mão" },
  { value: "central_multimida", label: "Central Multimídia" },
  { value: "quickshifter", label: "Quickshifter" },
  { value: "controle_tracao", label: "Controle de Tração" },
  { value: "modos_pilotagem", label: "Modos de Pilotagem" },
];

export const cylinderRanges = [
  { value: "50", label: "Até 50cc" },
  { value: "125", label: "51cc - 125cc" },
  { value: "250", label: "126cc - 250cc" },
  { value: "300", label: "251cc - 300cc" },
  { value: "500", label: "301cc - 500cc" },
  { value: "750", label: "501cc - 750cc" },
  { value: "1000", label: "751cc - 1000cc" },
  { value: "1000+", label: "Acima de 1000cc" },
];

export const motoUsageCategories = [
  { value: "urbano", label: "Uso Urbano" },
  { value: "lazer", label: "Lazer" },
  { value: "trabalho", label: "Trabalho/Delivery" },
  { value: "viagem", label: "Viagens" },
  { value: "trilha", label: "Trilha" },
  { value: "esportivo", label: "Esportivo" },
];

// Filtros específicos para CAMINHÕES
export const truckTypes = [
  { value: "3_4", label: "3/4" },
  { value: "toco", label: "Toco" },
  { value: "truck", label: "Truck" },
  { value: "bitruck", label: "Bitruck" },
  { value: "cavalo_mecanico", label: "Cavalo Mecânico" },
  { value: "vuc", label: "VUC" },
  { value: "fora_estrada", label: "Fora de Estrada" },
];

export const truckTractions = [
  { value: "4x2", label: "4x2" },
  { value: "4x4", label: "4x4" },
  { value: "6x2", label: "6x2" },
  { value: "6x4", label: "6x4" },
  { value: "8x2", label: "8x2" },
  { value: "8x4", label: "8x4" },
];

export const truckBodies = [
  { value: "bau", label: "Baú" },
  { value: "bau_refrigerado", label: "Baú Frigorífico" },
  { value: "graneleiro", label: "Graneleiro" },
  { value: "cacamba", label: "Caçamba" },
  { value: "carroceria", label: "Carroceria" },
  { value: "munck", label: "Munck" },
  { value: "tanque", label: "Tanque" },
  { value: "plataforma", label: "Plataforma" },
  { value: "sider", label: "Sider" },
  { value: "prancha", label: "Prancha" },
  { value: "cegonheira", label: "Cegonheira" },
  { value: "gaiola", label: "Gaiola Boiadeira" },
  { value: "porta_container", label: "Porta-Container" },
  { value: "guincho", label: "Guincho/Reboque" },
];

export const truckCabins = [
  { value: "simples", label: "Cabine Simples" },
  { value: "leito", label: "Cabine Leito" },
  { value: "leito_alto", label: "Leito Teto Alto" },
  { value: "semi_leito", label: "Semi-Leito" },
];

// Opcionais específicos para Caminhões
export const truckOptionals = [
  { value: "ar_condicionado", label: "Ar Condicionado" },
  { value: "direcao_hidraulica", label: "Direção Hidráulica" },
  { value: "freio_motor", label: "Freio Motor" },
  { value: "retarder", label: "Retarder" },
  { value: "piloto_automatico", label: "Piloto Automático" },
  { value: "vidro_eletrico", label: "Vidros Elétricos" },
  { value: "trava_eletrica", label: "Travas Elétricas" },
  { value: "suspensao_ar", label: "Suspensão a Ar" },
  { value: "banco_pneumatico", label: "Banco Pneumático" },
  { value: "ar_quente", label: "Ar Quente" },
  { value: "som", label: "Som/Multimídia" },
  { value: "gps", label: "GPS/Rastreador" },
  { value: "camera_re", label: "Câmera de Ré" },
  { value: "tomada_forca", label: "Tomada de Força" },
];

// Potência para Caminhões (em CV)
export const truckPowerRanges = [
  { value: "100-200", label: "100-200 CV" },
  { value: "200-300", label: "200-300 CV" },
  { value: "300-400", label: "300-400 CV" },
  { value: "400-500", label: "400-500 CV" },
  { value: "500-600", label: "500-600 CV" },
  { value: "600+", label: "Acima de 600 CV" },
];

// Lugares/Ocupantes para Caminhões
export const truckSeatOptions = [
  { value: "1", label: "1 lugar" },
  { value: "2", label: "2 lugares" },
  { value: "3", label: "3 lugares" },
  { value: "4", label: "4 lugares" },
  { value: "6+", label: "6+ lugares (cabine estendida)" },
];

// Filtros específicos para VANS
export const vanSubcategories = [
  { value: "passageiro", label: "Passageiro" },
  { value: "furgao", label: "Furgão" },
  { value: "carroceria", label: "Carroceria" },
];

export const vanTractions = [
  { value: "dianteira", label: "Dianteira" },
  { value: "traseira", label: "Traseira" },
  { value: "4x4", label: "4x4" },
];

export const vanSeatRanges = [
  { value: "1-5", label: "1 a 5 lugares" },
  { value: "6-10", label: "6 a 10 lugares" },
  { value: "11-15", label: "11 a 15 lugares" },
  { value: "16-20", label: "16 a 20 lugares" },
  { value: "21-30", label: "21 a 30 lugares" },
  { value: "31+", label: "Acima de 30 lugares" },
];

export const vanOptionals = [
  { value: "ar_condicionado", label: "Ar Condicionado" },
  { value: "direcao_hidraulica", label: "Direção Hidráulica" },
  { value: "direcao_eletrica", label: "Direção Elétrica" },
  { value: "vidro_eletrico", label: "Vidros Elétricos" },
  { value: "trava_eletrica", label: "Travas Elétricas" },
  { value: "airbag", label: "Airbag" },
  { value: "abs", label: "Freios ABS" },
  { value: "sensor_estacionamento", label: "Sensor de Estacionamento" },
  { value: "camera_re", label: "Câmera de Ré" },
  { value: "central_multimidia", label: "Central Multimídia" },
  { value: "bluetooth", label: "Bluetooth" },
  { value: "gps", label: "GPS" },
  { value: "alarme", label: "Alarme" },
  { value: "som", label: "Som" },
  { value: "banco_couro", label: "Bancos de Couro" },
  { value: "banco_regulavel", label: "Banco Regulável" },
  { value: "retrovisor_eletrico", label: "Retrovisores Elétricos" },
  { value: "farol_neblina", label: "Farol de Neblina" },
  { value: "porta_lateral_eletrica", label: "Porta Lateral Elétrica" },
  { value: "ar_traseiro", label: "Ar Condicionado Traseiro" },
];

export const vanDoorOptions = [
  { value: "2", label: "2 portas" },
  { value: "3", label: "3 portas" },
  { value: "4", label: "4 portas" },
  { value: "5", label: "5 portas" },
  { value: "6", label: "6+ portas" },
];

export const vanEngineLiters = [
  { value: "1.0", label: "1.0" },
  { value: "1.4", label: "1.4" },
  { value: "1.5", label: "1.5" },
  { value: "1.6", label: "1.6" },
  { value: "1.8", label: "1.8" },
  { value: "2.0", label: "2.0" },
  { value: "2.2", label: "2.2" },
  { value: "2.3", label: "2.3" },
  { value: "2.5", label: "2.5" },
  { value: "2.8", label: "2.8" },
  { value: "3.0", label: "3.0+" },
];

export const steeringTypes = [
  { value: "hidraulica", label: "Hidráulica" },
  { value: "eletrica", label: "Elétrica" },
  { value: "eletrohidraulica", label: "Eletro-Hidráulica" },
  { value: "mecanica", label: "Mecânica" },
];

export const windowTypes = [
  { value: "eletrico", label: "Elétrico" },
  { value: "manual", label: "Manual" },
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

// =====================================
// Filtros específicos para ÔNIBUS
// =====================================

export const busSubcategories = [
  { value: "onibus", label: "Ônibus" },
  { value: "micro_onibus", label: "Micro-Ônibus" },
];

export const busTractions = [
  { value: "4x2", label: "4x2" },
  { value: "6x2", label: "6x2" },
  { value: "8x2", label: "8x2" },
];

export const busSeatRanges = [
  { value: "1-15", label: "1 a 15 lugares" },
  { value: "16-25", label: "16 a 25 lugares" },
  { value: "26-35", label: "26 a 35 lugares" },
  { value: "36-45", label: "36 a 45 lugares" },
  { value: "46-55", label: "46 a 55 lugares" },
  { value: "56-70", label: "56 a 70 lugares" },
  { value: "71-99", label: "71 a 99 lugares" },
];

export const busFuelTypes = [
  { value: "diesel", label: "Diesel" },
  { value: "gnv", label: "GNV" },
  { value: "eletrico", label: "Elétrico" },
  { value: "hibrido", label: "Híbrido" },
];

export const busOptionals = [
  { value: "ar_condicionado", label: "Ar Condicionado" },
  { value: "ar_digital", label: "Ar Digital" },
  { value: "ar_duas_zonas", label: "Ar 2 Zonas" },
  { value: "ar_tres_zonas", label: "Ar 3+ Zonas" },
  { value: "abs", label: "Freios ABS" },
  { value: "alarme", label: "Alarme" },
  { value: "direcao_hidraulica", label: "Direção Hidráulica" },
  { value: "direcao_eletrica", label: "Direção Elétrica" },
  { value: "dvd_player", label: "DVD Player" },
  { value: "tv", label: "TV" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "usb", label: "Carregadores USB" },
  { value: "tomadas_110v", label: "Tomadas 110V" },
  { value: "banheiro", label: "Banheiro" },
  { value: "geladeira", label: "Geladeira/Frigobar" },
  { value: "cortinas", label: "Cortinas" },
  { value: "porta_automatica", label: "Porta Automática" },
  { value: "elevador_pcd", label: "Elevador PCD" },
  { value: "camera_re", label: "Câmera de Ré" },
  { value: "sensor_ponto_cego", label: "Sensor de Ponto Cego" },
  { value: "gps", label: "GPS/Rastreador" },
  { value: "tacografo", label: "Tacógrafo" },
  { value: "poltronas_reclinaveis", label: "Poltronas Reclináveis" },
  { value: "apoio_pe", label: "Apoio para Pés" },
  { value: "bagageiro_interno", label: "Bagageiro Interno" },
  { value: "bagageiro_externo", label: "Bagageiro Externo" },
  { value: "som", label: "Som/Multimídia" },
  { value: "microfone", label: "Sistema de Microfone" },
  { value: "retarder", label: "Retarder" },
  { value: "freio_motor", label: "Freio Motor" },
];
