const BASE_URL =
  "https://coatunyealgfrmpszpsu.supabase.co/functions/v1";

export class Opix {
  constructor(private apiKey: string) {}

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    body?: unknown
  ): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error?.message || "Unknown API error");
    }

    return json.data;
  }

  validateKey() {
    return this.request("POST", "/api-keys-validate");
  }

  listAuthorizations() {
    return this.request("GET", "/authorizations-list");
  }

  createAuthorization(payload: any) {
    return this.request("POST", "/authorizations-create", payload);
  }

  revokeAuthorization(id: string) {
    return this.request("POST", "/authorizations-revoke", { id });
  }

  listEvents(params?: { limit?: number; since?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request("GET", `/events-list${query ? `?${query}` : ""}`);
  }

  trackEvent(payload: any) {
    return this.request("POST", "/events-track", payload);
  }
}

export const createClient = (apiKey: string) => new Opix(apiKey);
