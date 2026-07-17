import { defineMcp } from "@lovable.dev/mcp-js";
import searchVehiclesTool from "./tools/search-vehicles";
import getVehicleTool from "./tools/get-vehicle";

// MCP público: expõe apenas o catálogo de anúncios já aprovados (dados
// públicos, também acessíveis sem login em zedorolo.com). Nenhuma ferramenta
// acessa dados de usuários — sem tokens, sem service role.
export default defineMcp({
  name: "ze-do-rolo-mcp",
  title: "Zé do Rolo",
  version: "0.1.0",
  instructions:
    "Ferramentas para navegar no catálogo público do Zé do Rolo — marketplace brasileiro de veículos (carros, motos, caminhões, tratores, ônibus, vans, implementos). Use search_vehicles para descobrir anúncios por marca/modelo/cidade/preço e get_vehicle para detalhes completos.",
  tools: [searchVehiclesTool, getVehicleTool],
});
