import {
  buildProxyHeaders,
  proxyJsonRequest,
  readProxyBody,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";
import type { CreateStudentInvitePayload, StudentInviteSnapshot } from "~/features/parent-students";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const studentId = String(getRouterParam(event, "studentId") || "").trim();
  const headers = buildProxyHeaders(event, { includeAuth: true });

  if (!headers) {
    return unauthorizedProblem();
  }

  if (!studentId) {
    throw createError({ statusCode: 400, statusMessage: "student_id is required" });
  }

  headers.set("Content-Type", "application/json");
  const body = await readProxyBody(event);

  return await proxyJsonRequest<StudentInviteSnapshot>(event, {
    body: body as CreateStudentInvitePayload,
    headers,
    method: "POST",
    url:
      `${resolveServiceBaseUrl(runtimeConfig.usersServiceBaseUrl, "http://localhost:8002")}` +
      `/v1/parent/me/students/${studentId}/invite`
  });
});
