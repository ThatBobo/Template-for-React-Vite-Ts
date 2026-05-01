const BASE_URL =
  "https://coatunyealgfrmpszpsu.supabase.co/functions/v1";

export class Opix {
  constructor(
    private clientId: string,
    private apiKey: string
  ) {}

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    body?: unknown
  ): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "X-Client-ID": this.clientId,
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
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

  createAuthorization(payload: {
    app_name: string;
    app_url: string;
    app_icon?: string;
    description?: string;
    redirect_uri: string;
    scopes: string[];
  }) {
    return this.request("POST", "/authorizations-create", payload);
  }

  revokeAuthorization(id: string) {
    return this.request("POST", "/authorizations-revoke", { id });
  }

  listEvents(params?: { limit?: number; since?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request("GET", `/events-list${query ? `?${query}` : ""}`);
  }

  trackEvent(payload: {
    integration_id: string;
    event_type: string;
    payload?: any;
    response?: any;
    status_code?: number;
  }) {
    return this.request("POST", "/events-track", payload);
  }
}

export const createClient = (clientId: string, apiKey: string) =>
  new Opix(clientId, apiKey);
