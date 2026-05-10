import {
  buildProxyHeaders,
  proxyJsonRequest,
  readProxyBody,
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

  headers.set("Content-Type", "application/json");

  return await proxyJsonRequest<PaymentIntentSnapshot>(event, {
    body: await readProxyBody(event),
    headers,
    method: "POST",
    url: `${resolveServiceBaseUrl(runtimeConfig.paymentsServiceBaseUrl, "http://localhost:8004")}/v1/parent/payments/intents`
  });
});
