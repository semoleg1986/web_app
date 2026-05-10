import {
  buildProxyHeaders,
  proxyJsonRequest,
  readProxyQuery,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";
import type { BonusLedgerEntry } from "~/features/bonus/api/bonus-client";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event, { includeAuth: true });

  if (!headers) {
    return unauthorizedProblem();
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(readProxyQuery(event))) {
    if (Array.isArray(value)) {
      query.set(key, value[0] ?? "");
      continue;
    }

    if (value !== undefined) {
      query.set(key, String(value));
    }
  }

  const querySuffix = query.toString() ? `?${query.toString()}` : "";

  return await proxyJsonRequest<BonusLedgerEntry[]>(event, {
    headers,
    method: "GET",
    url: `${resolveServiceBaseUrl(runtimeConfig.bonusServiceBaseUrl, "http://localhost:8006")}/v1/parent/bonus/ledger${querySuffix}`
  });
});
