import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerInsuranceTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "insurance_list",
    "List all insurance policies (life, health, property, etc.) with type, provider, policy name, payment info, coverage limits, and status.",
    {},
    async () => {
      const data = await client.get("/insurance");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "insurance_detail",
    "Get full details for a specific insurance policy including any linked documents.",
    { id: z.string().describe("The insurance policy ID") },
    async ({ id }) => {
      const data = await client.get(`/insurance/${id}`);
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
