import {
  buildProxyHeaders,
  proxyJsonRequest,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";
import type { PaymentIntentSnapshot } from "~/features/payments/api/payments-client";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event, { includeAuth: true });

  if (!headers) {
    return unauthorizedProblem();
  }

  const paymentIntentId = getRouterParam(event, "paymentIntentId");

  return await proxyJsonRequest<PaymentIntentSnapshot>(event, {
    headers,
    method: "GET",
    url: `${resolveServiceBaseUrl(runtimeConfig.paymentsServiceBaseUrl, "http://localhost:8004")}/v1/parent/payments/intents/${paymentIntentId}`
  });
});
