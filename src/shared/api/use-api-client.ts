import type { FetchError, FetchOptions } from "ofetch";

import { ApiRequestError, type ApiProblemDetails } from "~/shared/api/types";
import { normalizeApiError, resolveApiUrl } from "~/shared/api/http";

interface ApiRequestOptions<TBody> {
  body?: TBody;
  headers?: FetchOptions["headers"];
  method?: string;
}

export function useApiClient() {
  const runtimeConfig = useRuntimeConfig();

  async function request<TResponse, TBody = undefined>(
    path: string,
    options: ApiRequestOptions<TBody> = {}
  ) {
    try {
      return await $fetch<TResponse>(
        resolveApiUrl(path, runtimeConfig.public.apiBaseUrl),
        options
      );
    } catch (error) {
      const normalized = normalizeApiError(
        error as FetchError<ApiProblemDetails> | null | undefined
      );

      if (normalized) {
        throw new ApiRequestError(normalized);
      }

      throw error;
    }
  }

  return {
    request,
    get<TResponse>(path: string, headers?: FetchOptions["headers"]) {
      return request<TResponse>(path, { headers, method: "GET" });
    },
    post<TResponse, TBody>(
      path: string,
      body: TBody,
      headers?: FetchOptions["headers"]
    ) {
      return request<TResponse, TBody>(path, { body, headers, method: "POST" });
    }
  };
}
