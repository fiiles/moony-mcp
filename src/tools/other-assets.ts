import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerOtherAssetsTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "other_assets_list",
    "List all other assets such as precious metals, art, collectibles, etc. with quantity, market price, average purchase price, and yield info.",
    {},
    async () => {
      const data = await client.get("/other-assets");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "other_assets_transactions",
    "Get buy/sell transactions for a specific other asset.",
    { assetId: z.string().describe("The asset ID to get transactions for") },
    async ({ assetId }) => {
      const data = await client.get(`/other-assets/${assetId}/transactions`);
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
