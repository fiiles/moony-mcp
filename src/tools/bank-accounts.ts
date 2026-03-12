import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MoonyClient } from "../client.js";
import { toText } from "../utils.js";

export function registerBankAccountsTools(server: McpServer, client: MoonyClient): void {
  server.tool(
    "bank_accounts_list",
    "List all bank accounts with institution info, account type, IBAN, balance, currency, and interest rate.",
    {},
    async () => {
      const data = await client.get("/bank-accounts");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "bank_categories",
    "List all transaction categories (system-defined and user-created) with their icons, colors, and hierarchy.",
    {},
    async () => {
      const data = await client.get("/bank-categories");
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );

  server.tool(
    "bank_transactions",
    "Get bank transactions for a specific account with optional filtering by date range, category, transaction type, and text search.",
    {
      accountId: z.string().describe("The bank account ID to get transactions for"),
      dateFrom: z.number().optional().describe("Start date as Unix timestamp (seconds)"),
      dateTo: z.number().optional().describe("End date as Unix timestamp (seconds)"),
      categoryId: z.string().optional().describe("Filter by category ID"),
      txType: z.enum(["credit", "debit"]).optional().describe("Filter by transaction type"),
      search: z.string().optional().describe("Search text in description or counterparty name"),
      limit: z.number().int().min(1).max(1000).optional().default(100).describe("Max transactions to return"),
      offset: z.number().int().min(0).optional().default(0).describe("Pagination offset"),
    },
    async ({ accountId, dateFrom, dateTo, categoryId, txType, search, limit = 100, offset = 0 }) => {
      const data = await client.get(`/bank-accounts/${accountId}/transactions`, {
        dateFrom, dateTo, categoryId, txType, search, limit, offset,
      });
      return { content: [{ type: "text", text: toText(data) }] };
    }
  );
}
