import { createError } from "h3";

import {
  buildProxyHeaders,
  proxyJsonRequest,
  resolveServiceBaseUrl
} from "~/server/utils/upstream-proxy";

interface UpstreamPublicCourseDetails {
  description: string | null;
  lessons_total: number;
  level: string;
  slug: string;
  title: string;
}

export default defineEventHandler(async (event) => {
  const courseId = getRouterParam(event, "id");
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: "Course id is required" });
  }

  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event) ?? new Headers();

  const upstream = await proxyJsonRequest<UpstreamPublicCourseDetails>(event, {
    headers,
    method: "GET",
    url: `${resolveServiceBaseUrl(runtimeConfig.courseServiceBaseUrl, "http://localhost:8001")}/v1/public/courses/${courseId}`
  });

  if (typeof upstream !== "object" || upstream === null || !("slug" in upstream)) {
    return upstream;
  }

  return {
    item: {
      description: upstream.description ?? "",
      id: upstream.slug,
      lessonsCount: upstream.lessons_total,
      level: upstream.level,
      title: upstream.title
    }
  };
});
