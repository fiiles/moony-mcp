import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

export interface Session {
  port: number;
  token: string;
  pid: number;
  version: number;
}

export function loadSession(dataDir: string): Session {
  const sessionPath = path.join(dataDir, 'session.json');

  if (!existsSync(sessionPath)) {
    throw new Error(
      'session.json not found. Open Moony, unlock it, and enable the MCP Server in Settings.'
    );
  }

  const session: Session = JSON.parse(readFileSync(sessionPath, 'utf-8'));

  try {
    process.kill(session.pid, 0);
  } catch {
    throw new Error(
      `Moony process (PID ${session.pid}) is not running. Open and unlock Moony first.`
    );
  }

  return session;
}
