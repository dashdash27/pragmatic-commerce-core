import type { ApiFetchOptions, BackendErrorResponse } from "../types/api";

export class ApiError extends Error {
  status: number;
  code: string;
  details: unknown;

  constructor(
    message: string,
    status: number,
    code = "UNKNOWN_ERROR",
    details: unknown = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.INTERNAL_API_URL || "http://backend:8000/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { withAuth = false, token, headers, ...restOptions } = options;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (
    !(restOptions.body instanceof FormData) &&
    !requestHeaders["Content-Type"]
  ) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (withAuth || token) {
    // TODO:
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const res = await fetch(`${getBaseUrl()}${cleanEndpoint}`, {
    headers: requestHeaders,
    ...restOptions,
  });

  if (!res.ok) {
    let errorData: Partial<BackendErrorResponse> | null = null;

    try {
      errorData = (await res.json()) as Partial<BackendErrorResponse>;
    } catch {}

    const message =
      errorData?.message ?? getFallbackMessageByStatus(res.status);
    throw new ApiError(
      message,
      res.status,
      errorData?.code,
      errorData?.details,
    );
  }

  return res.json() as Promise<T>;
}

function getFallbackMessageByStatus(status: number): string {
  switch (status) {
    case 502:
    case 503:
    case 504:
      return "Сервис временно недоступен. Попробуйте через несколько секунд.";
    default:
      return `Ошибка соединения с сервером (код ${status}).`;
  }
}
