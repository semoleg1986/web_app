import {
  buildProxyHeaders,
  proxyJsonRequest,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";
import type { CourseAccessDecisionSnapshot } from "~/features/course-access";

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

  headers.set("Content-Type", "application/json");

  return await proxyJsonRequest<CourseAccessDecisionSnapshot>(event, {
    body: {
      course_id: courseId,
      require_active_grant: true,
      require_enrollment: false,
      student_id: null
    },
    headers,
    method: "POST",
    url:
      `${resolveServiceBaseUrl(runtimeConfig.courseServiceBaseUrl, "http://localhost:8001")}` +
      "/internal/v1/access/check-by-token"
  });
});
