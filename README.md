# moony-mcp

MCP (Model Context Protocol) server for [Moony](https://github.com/fiiles/moony-tauri) — connects AI assistants like Claude to your local personal finance data.

## How it works

When Moony is running and unlocked with **MCP Server** enabled in Settings, it starts a lightweight local HTTP API on a random port and writes a `session.json` file containing the port and a per-session bearer token.

This MCP server reads `session.json`, connects to that local API, and exposes your financial data as tools that AI assistants can query. **Your data never leaves your device** — everything happens over `localhost`.

## Prerequisites

- [Moony](https://github.com/fiiles/moony-tauri) installed and running
- Node.js 18 or later
- Claude Desktop or another MCP-compatible AI client

## Setup

### 1. Install the MCP server

```bash
git clone https://github.com/fiiles/moony-mcp.git
cd moony-mcp
npm install
npm run build
```

Note the **absolute path** to `dist/index.js` — you will need it in the next step.

### 2. Enable MCP Server in Moony

Open Moony → **Settings** → enable **AI Assistant (MCP Server)**.

### 3. Configure Claude Desktop

Moony's **Settings screen shows the exact config snippet** with the correct paths pre-filled for your system — you can copy it directly from there.

Alternatively, add the following to your Claude Desktop config file manually:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "moony-finance": {
      "command": "node",
      "args": ["/absolute/path/to/moony-mcp/dist/index.js"],
      "env": {
        "MOONY_DATA_DIR": "/absolute/path/to/Moony/data/directory"
      }
    }
  }
}
```

> **Important:** Do not use `~` in JSON paths. Use the full absolute path.  
> The exact `MOONY_DATA_DIR` path is shown in Moony → **Settings** → AI Assistant section.

### 4. Restart Claude Desktop

After restarting, Claude will have access to your Moony financial data. Moony must be **running and unlocked** with MCP Server enabled each time you want to use the integration.

## Available tools

| Tool | Description |
|------|-------------|
| `portfolio_get_metrics` | Current net worth breakdown by asset class |
| `portfolio_get_history` | Historical net worth snapshots over time |
| `investments_list` | All stock holdings |
| `investment_detail` | Detail + transactions for a specific stock |
| `stock_transactions` | Stock buy/sell transaction history |
| `stock_value_history` | Historical value for a specific ticker |
| `crypto_list` | All cryptocurrency holdings |
| `crypto_transactions` | Crypto buy/sell transaction history |
| `crypto_value_history` | Historical value for a specific crypto |
| `bank_accounts_list` | All bank accounts with balances |
| `bank_transactions` | Bank transactions with filtering |
| `bank_categories` | Transaction categories |
| `savings_list` | Savings accounts with interest rates |
| `bonds_list` | Bond holdings |
| `loans_list` | Loans and mortgages |
| `real_estate_list` | Real estate properties |
| `real_estate_detail` | Detail for a specific property |
| `insurance_list` | Insurance policies |
| `insurance_detail` | Detail for a specific policy |
| `other_assets_list` | Other assets (metals, collectibles, etc.) |
| `other_assets_transactions` | Transactions for a specific other asset |
| `cashflow_report` | Income vs expenses cashflow report |
| `budgeting_report` | Budget vs actual spending by category |
| `stocks_analysis` | Stock portfolio analysis with gain/loss |
| `tag_metrics` | Portfolio metrics grouped by stock tag |
| `exchange_rates_list` | Current ECB exchange rates (base: CZK) |

## Environment variable

| Variable | Required | Description |
|----------|----------|-------------|
| `MOONY_DATA_DIR` | Yes | Path to the Moony data directory (contains `session.json` when app is unlocked). The exact path is shown in Moony → Settings → AI Assistant. |

## Security

- The MCP server only reads from Moony's **read-only** local API — your data cannot be modified through it
- The bearer token in `session.json` is regenerated every time Moony starts
- Communication is strictly `localhost` — no network access required

## License

MIT
