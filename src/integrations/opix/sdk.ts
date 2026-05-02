// src/integrations/opix/sdk.ts
const BASE_URL = "https://coatunyealgfrmpszpsu.supabase.co/functions/v1";

export type OpixClient = ReturnType<typeof createClient>;

export const createClient = (clientId: string, apiKey: string) => {
  const request = async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
    const json = await res.json();
    if (!res.ok || json.error) {
      throw new Error(json.error?.message ?? `Opix request failed: ${res.status}`);
    }
    return json.data as T;
  };

  return {
    clientId,
    validate: () =>
      request<{ valid: boolean; scopes: string[] }>("/api-keys-validate", { method: "POST" }),
    track: (input: {
      event_type: string;
      payload?: Record<string, unknown>;
      status_code?: number;
    }) =>
      request("/events-track", {
        method: "POST",
        body: JSON.stringify({ authorization_id: clientId, ...input }),
      }),
    listEvents: (params?: { limit?: number; since?: string }) => {
      const qs = new URLSearchParams(
        Object.entries(params ?? {}).filter(([, v]) => v != null) as [string, string][],
      ).toString();
      return request(`/events-list${qs ? `?${qs}` : ""}`);
    },
  };
};
