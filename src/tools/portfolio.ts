import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerPortfolioTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "portfolio_get_history",
    "Get historical portfolio snapshots showing net worth over time. Each record contains per-asset-class totals in CZK. Useful for trend analysis.",
    {
      startDate: z.number().optional().describe("Start date as Unix timestamp (seconds)"),
      endDate: z.number().optional().describe("End date as Unix timestamp (seconds)"),
      limit: z.number().int().min(1).max(3650).optional().default(365).describe("Max records to return"),
    },
    async ({ startDate, endDate, limit = 365 }) => {
      const data = await client.get("/portfolio/history", { startDate, endDate, limit });
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "portfolio_get_metrics",
    "Get current portfolio metrics: net worth breakdown by asset class (savings, investments, crypto, bonds, real estate, other assets, liabilities). All monetary values are in CZK.",
    {
      excludePersonalRealEstate: z
        .boolean()
        .optional()
        .default(false)
        .describe("Exclude personal-use real estate from net worth calculation"),
    },
    async ({ excludePersonalRealEstate = false }) => {
      const data = await client.get("/portfolio/metrics", { excludePersonalRealEstate });
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
