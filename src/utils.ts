/**
 * Serialize data to a human-readable JSON string for MCP tool responses.
 */
export function toText(data: unknown): string {
  return JSON.stringify(data, null, 2);
}
