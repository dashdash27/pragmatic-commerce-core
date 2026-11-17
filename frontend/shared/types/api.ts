export interface ApiFetchOptions extends RequestInit {
  withAuth?: boolean;
  token?: string;
}

export interface BackendErrorResponse {
  code: string;
  message: string;
  details: unknown;
}
