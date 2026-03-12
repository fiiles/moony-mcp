import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerSavingsTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "savings_list",
    "List all bank and savings accounts with balances, interest rates, and tiered interest rate zones if applicable.",
    {},
    async () => {
      const data = await client.get("/savings");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
