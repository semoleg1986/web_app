import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useFetch, useRequestFetch } from "nuxt/app";
import type { UseFetchOptions } from "nuxt/app";
import type { FetchError } from "ofetch";

import type { ApiProblemDetails } from "~/shared/api/types";
import { normalizeApiError, resolveApiUrl } from "~/shared/api/http";

export function useApiQuery<TResponse>(
  path: MaybeRefOrGetter<string | null | undefined>,
  options: UseFetchOptions<TResponse> = {}
) {
  const runtimeConfig = useRuntimeConfig();
  const isEnabled = computed(() => {
    const resolvedPath = toValue(path);
    return typeof resolvedPath === "string" && resolvedPath.trim().length > 0;
  });
  const url = computed(() => {
    const resolvedPath = toValue(path);
    if (!resolvedPath) {
      return undefined;
    }
    return resolveApiUrl(resolvedPath, runtimeConfig.public.apiBaseUrl);
  });
  const method = String(options.method ?? "GET").toUpperCase();
  const key = options.key ?? computed(() => `${method}:${url.value ?? "__disabled__"}`);
  const requestFetch =
    import.meta.server && !options.$fetch ? useRequestFetch() : globalThis.$fetch;
  const guardedFetch: typeof globalThis.$fetch = async (request, fetchOptions) => {
    if (typeof request !== "string" || request.trim().length === 0) {
      return undefined as TResponse;
    }
    return requestFetch<TResponse>(request, fetchOptions);
  };

  const request = useFetch<TResponse>(() => url.value as string, {
    ...options,
    immediate: options.immediate ?? isEnabled,
    key,
    $fetch: guardedFetch
  });

  return {
    ...request,
    apiError: computed(() =>
      normalizeApiError(request.error.value as FetchError<ApiProblemDetails> | null | undefined)
    )
  };
}
