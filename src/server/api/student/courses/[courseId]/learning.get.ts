import {
  buildProxyHeaders,
  proxyJsonRequest,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";
import type { StudentCourseLearningSnapshot } from "~/features/course-learning";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event, { includeAuth: true });

  if (!headers) {
    return unauthorizedProblem();
  }

  const courseId = String(getRouterParam(event, "courseId") || "").trim();
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: "Course id is required" });
  }

  return await proxyJsonRequest<StudentCourseLearningSnapshot>(event, {
    headers,
    method: "GET",
    url:
      `${resolveServiceBaseUrl(runtimeConfig.courseServiceBaseUrl, "http://localhost:8001")}` +
      `/v1/student/courses/${courseId}/learning`
  });
});
