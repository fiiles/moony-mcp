import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerAnalyticsTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "cashflow_report",
    "Get an income vs expenses cashflow report based on user-defined cashflow items (recurring income/expenses), loan payments, insurance premiums, and savings account interest. View as monthly or yearly totals.",
    {
      viewType: z
        .enum(["monthly", "yearly"])
        .default("monthly")
        .describe("Whether to show monthly or yearly amounts"),
    },
    async ({ viewType = "monthly" }) => {
      const data = await client.get("/analytics/cashflow", { viewType });
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "budgeting_report",
    "Get a budget vs actual spending report by category for a given time period. Shows how much was spent vs budget goals.",
    {
      startDate: z.number().describe("Start date as Unix timestamp (seconds)"),
      endDate: z.number().describe("End date as Unix timestamp (seconds)"),
      timeframe: z
        .enum(["monthly", "quarterly", "yearly"])
        .default("monthly")
        .describe("Budget timeframe to compare against"),
    },
    async ({ startDate, endDate, timeframe = "monthly" }) => {
      const data = await client.get("/analytics/budgeting", { startDate, endDate, timeframe });
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "stocks_analysis",
    "Get all stock investments with their current value, gain/loss, dividend yield, and tag groupings.",
    {},
    async () => {
      const data = await client.get("/analytics/stocks");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "tag_metrics",
    "Get aggregated portfolio metrics grouped by stock tag. Shows total value, cost basis, gain/loss, and dividend yield per tag.",
    {
      tagIds: z
        .array(z.string())
        .optional()
        .describe("Filter to specific tag IDs. Omit to get metrics for all tags."),
    },
    async ({ tagIds }) => {
      const data = await client.get("/analytics/tags", {
        tagIds: tagIds ? tagIds.join(',') : undefined,
      });
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
