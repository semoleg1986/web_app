import type { UseFetchOptions } from "nuxt/app";
import type { FetchError } from "ofetch";

import type { ApiProblemDetails } from "~/shared/api/types";
import { normalizeApiError, resolveApiUrl } from "~/shared/api/http";

export function useApiQuery<TResponse>(
  path: MaybeRefOrGetter<string>,
  options: UseFetchOptions<TResponse> = {}
) {
  const runtimeConfig = useRuntimeConfig();
  const url = computed(() => resolveApiUrl(toValue(path), runtimeConfig.public.apiBaseUrl));
  const method = String(options.method ?? "GET").toUpperCase();
  const key = options.key ?? computed(() => `${method}:${url.value}`);
  const request = useFetch<TResponse>(url, { ...options, key });

  return {
    ...request,
    apiError: computed(() =>
      normalizeApiError(
        request.error.value as FetchError<ApiProblemDetails> | null | undefined
      )
    )
  };
}
