const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

type ApiOptions = {
  method?: string;
  token?: string;
  body?: unknown;
  headers?: HeadersInit;
};

export async function apiFetch<T>(
  path: string,
  { method = "GET", token, body, headers }: ApiOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Content-Type", "application/json");
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    cache: "no-store",
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await safeReadError(response);
    throw new Error(
      message || `Request to ${path} failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return (await response.json()) as T;
}

async function safeReadError(response: Response) {
  try {
    const data = await response.json();
    if (typeof data === "string") return data;
    if (data?.message) return data.message as string;
  } catch (error) {
    return response.statusText;
  }
  return response.statusText;
}
