import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerExchangeRatesTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "exchange_rates_list",
    "Get stored currency exchange rates. The base currency is CZK (rate = 1.0). Rates are fetched from the European Central Bank and cached locally.",
    {},
    async () => {
      const data = await client.get("/exchange-rates");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
