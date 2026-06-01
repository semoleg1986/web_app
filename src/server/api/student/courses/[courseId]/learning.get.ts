import { setHeader, setResponseStatus, type H3Event } from "h3";

import {
  buildProxyHeaders,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";
import type {
  StudentCourseLearningState,
  StudentCourseLearningSnapshot
} from "~/features/course-learning";

interface UpstreamProblem {
  detail?: string;
  [key: string]: unknown;
}

function setUpstreamTraceHeaders(event: H3Event, response: Response) {
  const requestId = response.headers.get("x-request-id");
  const correlationId = response.headers.get("x-correlation-id");

  if (requestId) {
    setHeader(event, "X-Request-ID", requestId);
  }

  if (correlationId) {
    setHeader(event, "X-Correlation-ID", correlationId);
  }
}

async function readUpstreamProblem(response: Response): Promise<UpstreamProblem> {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as UpstreamProblem;
  }

  return { detail: await response.text() };
}

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

  const response = await fetch(
    `${resolveServiceBaseUrl(runtimeConfig.courseServiceBaseUrl, "http://localhost:8001")}` +
      `/v1/student/courses/${courseId}/learning`,
    {
      headers,
      method: "GET"
    }
  );
  setUpstreamTraceHeaders(event, response);

  if (response.status === 403) {
    const problem = await readUpstreamProblem(response);
    return {
      access_state: "denied",
      course_id: courseId,
      detail: typeof problem.detail === "string" ? problem.detail : "Access denied"
    } satisfies StudentCourseLearningState;
  }

  if (!response.ok) {
    const problem = await readUpstreamProblem(response);
    setResponseStatus(event, response.status, response.statusText);
    return problem;
  }

  const snapshot = (await response.json()) as Omit<StudentCourseLearningSnapshot, "access_state">;
  return {
    ...snapshot,
    access_state: "granted"
  } satisfies StudentCourseLearningState;
});
