import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerBondsTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "bonds_list",
    "List all bond holdings with name, ISIN, coupon value, quantity, currency, interest rate, and maturity date.",
    {},
    async () => {
      const data = await client.get("/bonds");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
