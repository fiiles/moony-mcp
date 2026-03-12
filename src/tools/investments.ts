import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerInvestmentsTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "investments_list",
    "List all stock investments with ticker, company name, quantity, average purchase price, currency, and current market price.",
    {},
    async () => {
      const data = await client.get("/investments");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "investment_detail",
    "Get full details for a specific stock investment including all its transactions.",
    { id: z.string().describe("The stock investment ID") },
    async ({ id }) => {
      const data = await client.get(`/investments/${id}`);
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "stock_transactions",
    "Get all stock buy/sell transactions, optionally filtered by ticker symbol.",
    {
      ticker: z.string().optional().describe("Filter by ticker symbol (e.g. AAPL, MSFT)"),
      limit: z.number().int().min(1).max(1000).optional().default(200).describe("Max records to return"),
    },
    async ({ ticker, limit = 200 }) => {
      const data = await client.get("/investments/transactions", { ticker, limit });
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "stock_value_history",
    "Get historical value snapshots for a specific stock ticker. Values are in CZK.",
    {
      ticker: z.string().describe("The stock ticker symbol (e.g. AAPL)"),
      startDate: z.number().optional().describe("Start date as Unix timestamp (seconds)"),
      endDate: z.number().optional().describe("End date as Unix timestamp (seconds)"),
    },
    async ({ ticker, startDate, endDate }) => {
      const data = await client.get(`/investments/${ticker}/history`, { startDate, endDate });
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
