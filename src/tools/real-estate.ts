import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerRealEstateTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "real_estate_list",
    "List all real estate properties with name, address, type, purchase price, market price, and monthly rent.",
    {},
    async () => {
      const data = await client.get("/real-estate");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "real_estate_detail",
    "Get full details for a specific property including one-time costs.",
    { id: z.string().describe("The real estate property ID") },
    async ({ id }) => {
      const data = await client.get(`/real-estate/${id}`);
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
