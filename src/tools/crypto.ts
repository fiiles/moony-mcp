import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerCryptoTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "crypto_list",
    "List all cryptocurrency holdings with ticker, name, CoinGecko ID, quantity, average purchase price, and current market price.",
    {},
    async () => {
      const data = await client.get("/crypto");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "crypto_transactions",
    "Get all cryptocurrency buy/sell transactions, optionally filtered by ticker symbol.",
    {
      ticker: z.string().optional().describe("Filter by ticker symbol (e.g. BTC, ETH)"),
      limit: z.number().int().min(1).max(1000).optional().default(200).describe("Max records to return"),
    },
    async ({ ticker, limit = 200 }) => {
      const data = await client.get("/crypto/transactions", { ticker, limit });
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "crypto_value_history",
    "Get historical value snapshots for a specific cryptocurrency ticker. Values are in CZK.",
    {
      ticker: z.string().describe("The crypto ticker symbol (e.g. BTC, ETH)"),
      startDate: z.number().optional().describe("Start date as Unix timestamp (seconds)"),
      endDate: z.number().optional().describe("End date as Unix timestamp (seconds)"),
    },
    async ({ ticker, startDate, endDate }) => {
      const data = await client.get(`/crypto/${ticker}/history`, { startDate, endDate });
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
