import {
  buildProxyHeaders,
  proxyJsonRequest,
  readProxyBody,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";
import type {
  CreateMyStudentPayload,
  ParentStudentItem
} from "~/features/parent-students";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event, { includeAuth: true });

  if (!headers) {
    return unauthorizedProblem();
  }

  headers.set("Content-Type", "application/json");
  const body = await readProxyBody(event);

  return await proxyJsonRequest<ParentStudentItem>(event, {
    body: body as CreateMyStudentPayload,
    headers,
    method: "POST",
    url: `${resolveServiceBaseUrl(runtimeConfig.usersServiceBaseUrl, "http://localhost:8002")}/v1/parent/me/students`
  });
});
