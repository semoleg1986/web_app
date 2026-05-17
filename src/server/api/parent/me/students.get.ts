import {
  buildProxyHeaders,
  proxyJsonRequest,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";
import type { ParentStudentListResponse } from "~/features/parent-students/api/parent-students-client";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event, { includeAuth: true });

  if (!headers) {
    return unauthorizedProblem();
  }

  return await proxyJsonRequest<ParentStudentListResponse>(event, {
    headers,
    method: "GET",
    url: `${resolveServiceBaseUrl(runtimeConfig.usersServiceBaseUrl, "http://localhost:8002")}/v1/parent/me/students`
  });
});
