import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerLoansTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "loans_list",
    "List all loans (mortgages, personal loans, etc.) with principal, currency, interest rate, monthly payment, start date, and end date.",
    {},
    async () => {
      const data = await client.get("/loans");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
