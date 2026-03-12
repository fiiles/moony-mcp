#!/usr/bin/env node
/**
 * Moony MCP Server v2
 *
 * Connects to the local HTTP API served by Moony (Tauri app) when unlocked.
 * No database access, no passwords -- just reads session.json written by Moony.
 *
 * Required environment variable:
 *   MOONY_DATA_DIR  - Path to the Moony data directory (contains session.json)
 *
 * Moony must be running and unlocked, with MCP Server enabled in Settings.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadSession } from "./session.js";
import { MoonyClient } from "./client.js";
import { registerPortfolioTools } from "./tools/portfolio.js";
import { registerInvestmentsTools } from "./tools/investments.js";
import { registerCryptoTools } from "./tools/crypto.js";
import { registerBankAccountsTools } from "./tools/bank-accounts.js";
import { registerBondsTools } from "./tools/bonds.js";
import { registerLoansTools } from "./tools/loans.js";
import { registerSavingsTools } from "./tools/savings.js";
import { registerRealEstateTools } from "./tools/real-estate.js";
import { registerInsuranceTools } from "./tools/insurance.js";
import { registerOtherAssetsTools } from "./tools/other-assets.js";
import { registerAnalyticsTools } from "./tools/analytics.js";
import { registerExchangeRatesTools } from "./tools/exchange-rates.js";

const dataDir = process.env.MOONY_DATA_DIR;

if (!dataDir) {
  console.error("[moony-mcp] Error: MOONY_DATA_DIR environment variable is required.");
  console.error("[moony-mcp] Set it to the Moony data directory (e.g. ~/Library/Application Support/com.filipkral.moony-tauri)");
  process.exit(1);
}

let session;
try {
  session = loadSession(dataDir);
  console.error(`[moony-mcp] Connected to Moony on port ${session.port} (PID ${session.pid})`);
} catch (err) {
  console.error("[moony-mcp]", err instanceof Error ? err.message : err);
  process.exit(1);
}

const client = new MoonyClient(session);

const server = new McpServer({
  name: "moony-finance",
  version: "2.0.0",
});

registerPortfolioTools(server, client);
registerInvestmentsTools(server, client);
registerCryptoTools(server, client);
registerBankAccountsTools(server, client);
registerBondsTools(server, client);
registerLoansTools(server, client);
registerSavingsTools(server, client);
registerRealEstateTools(server, client);
registerInsuranceTools(server, client);
registerOtherAssetsTools(server, client);
registerAnalyticsTools(server, client);
registerExchangeRatesTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[moony-mcp] Server running on stdio. Ready for connections.");
