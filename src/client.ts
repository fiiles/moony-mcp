import type { Session } from './session.js';

export class MoonyClient {
  private baseUrl: string;
  private token: string;

  constructor(session: Session) {
    this.baseUrl = `http://127.0.0.1:${session.port}`;
    this.token = session.token;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | string[] | undefined>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) {
          if (Array.isArray(v)) {
            url.searchParams.set(k, v.join(','));
          } else {
            url.searchParams.set(k, String(v));
          }
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${this.token}` },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(`Moony API error: ${response.status} ${response.statusText} (${endpoint})`);
    }

    return response.json() as Promise<T>;
  }
}
