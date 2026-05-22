import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { UseFetchOptions } from "nuxt/app";
import type { FetchError } from "ofetch";

import type { ApiProblemDetails } from "~/shared/api/types";
import { normalizeApiError, resolveApiUrl } from "~/shared/api/http";

export function useApiQuery<TResponse>(
  path: MaybeRefOrGetter<string | null | undefined>,
  options: UseFetchOptions<TResponse> = {}
) {
  const runtimeConfig = useRuntimeConfig();
  const url = computed(() => {
    const resolvedPath = toValue(path);
    if (!resolvedPath) {
      return undefined;
    }
    return resolveApiUrl(resolvedPath, runtimeConfig.public.apiBaseUrl);
  });
  const method = String(options.method ?? "GET").toUpperCase();
  const key = options.key ?? computed(() => `${method}:${url.value ?? "__disabled__"}`);
  const request = useFetch<TResponse>(() => url.value, { ...options, key });

  return {
    ...request,
    apiError: computed(() =>
      normalizeApiError(request.error.value as FetchError<ApiProblemDetails> | null | undefined)
    )
  };
}
