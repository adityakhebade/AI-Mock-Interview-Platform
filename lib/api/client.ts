const DEFAULT_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiFailureResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type PublicUser = {
  id: string;
  email: string;
  displayName: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export class ApiClientError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const buildUrl = (path: string, baseUrl = DEFAULT_API_BASE_URL): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl.replace(/\/$/, '')}${normalizedPath}`;
};

export async function apiRequest<T>(
  path: string,
  token: string | null,
  options: RequestInit = {},
  baseUrl = DEFAULT_API_BASE_URL
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, baseUrl), {
    ...options,
    headers,
  });

  const payload = (await response.json()) as ApiSuccessResponse<T> | ApiFailureResponse;

  if (!response.ok || !payload.success) {
    const errorPayload = payload as ApiFailureResponse;
    throw new ApiClientError(
      response.status,
      errorPayload.error?.code ?? 'INTERNAL_ERROR',
      errorPayload.error?.message ?? 'Request failed'
    );
  }

  return payload.data;
}

export async function getCurrentUser(
  token: string,
  baseUrl = DEFAULT_API_BASE_URL
): Promise<PublicUser> {
  return apiRequest<PublicUser>('/users/me', token, { method: 'GET' }, baseUrl);
}

export async function syncCurrentUser(
  token: string,
  baseUrl = DEFAULT_API_BASE_URL
): Promise<PublicUser> {
  return apiRequest<PublicUser>(
    '/users/sync',
    token,
    { method: 'POST' },
    baseUrl
  );
}
