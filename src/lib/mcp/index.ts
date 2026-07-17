import { defineMcp } from "@lovable.dev/mcp-js";
import searchVehiclesTool from "./tools/search-vehicles";
import getVehicleTool from "./tools/get-vehicle";
import listMyListingsTool from "./tools/list-my-listings";
import listMyProposalsTool from "./tools/list-my-proposals";

// Public MCP: sem OAuth. Ferramentas somente-leitura sobre dados públicos
// (anúncios aprovados). Ferramentas específicas do usuário retornam 401
// quando chamadas sem sessão porque as políticas RLS bloqueiam anon.
export default defineMcp({
  name: "ze-do-rolo-mcp",
  title: "Zé do Rolo",
  version: "0.1.0",
  instructions:
    "Ferramentas para acessar anúncios do marketplace Zé do Rolo (veículos, motos, caminhões, tratores, ônibus, vans e implementos). Use search_vehicles e get_vehicle para navegar no catálogo público. list_my_listings e list_my_proposals exigem um token de usuário autenticado.",
  tools: [searchVehiclesTool, getVehicleTool, listMyListingsTool, listMyProposalsTool],
});
