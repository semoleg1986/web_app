import {
  buildProxyHeaders,
  proxyJsonRequest,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";
import type { BonusBalanceSnapshot } from "~/features/bonus/api/bonus-client";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event, { includeAuth: true });

  if (!headers) {
    return unauthorizedProblem();
  }

  return await proxyJsonRequest<BonusBalanceSnapshot>(event, {
    headers,
    method: "GET",
    url: `${resolveServiceBaseUrl(runtimeConfig.bonusServiceBaseUrl, "http://localhost:8006")}/v1/parent/bonus/balance`
  });
});
