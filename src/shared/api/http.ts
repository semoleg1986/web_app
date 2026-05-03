import type { FetchError } from "ofetch";

import type { ApiClientError, ApiProblemDetails } from "~/shared/api/types";

const ABSOLUTE_URL_PATTERN = /^[a-z]+:\/\//i;

export function resolveApiUrl(path: string, baseUrl = "/api") {
  if (ABSOLUTE_URL_PATTERN.test(path)) {
    return path;
  }

  if (path.startsWith("/api/")) {
    return path;
  }

  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

export function normalizeApiError(
  error: FetchError<ApiProblemDetails> | null | undefined
): ApiClientError | null {
  if (!error) {
    return null;
  }

  const problem = error.data ?? null;

  return {
    statusCode: error.statusCode ?? problem?.status ?? null,
    statusMessage:
      problem?.detail ??
      problem?.title ??
      error.statusMessage ??
      error.message ??
      "Request failed",
    problem,
    requestId: typeof problem?.request_id === "string" ? problem.request_id : null,
    correlationId:
      typeof problem?.correlation_id === "string" ? problem.correlation_id : null
  };
}
