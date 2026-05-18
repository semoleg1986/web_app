import {
  buildProxyHeaders,
  proxyJsonRequest,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";
import type { CheckoutStateSnapshot } from "~/features/payments";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event, { includeAuth: true });

  if (!headers) {
    return unauthorizedProblem();
  }

  const studentId = getRouterParam(event, "studentId");
  const courseId = getRouterParam(event, "courseId");

  return await proxyJsonRequest<CheckoutStateSnapshot>(event, {
    headers,
    method: "GET",
    url: `${resolveServiceBaseUrl(runtimeConfig.paymentsServiceBaseUrl, "http://localhost:8004")}/v1/parent/payments/students/${studentId}/courses/${courseId}/checkout-state`
  });
});
