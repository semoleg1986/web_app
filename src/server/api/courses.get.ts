import {
  buildProxyHeaders,
  proxyJsonRequest,
  resolveServiceBaseUrl
} from "~/server/utils/upstream-proxy";

interface UpstreamPublicCourseCard {
  cover_image_url: string | null;
  course_id: string;
  description: string | null;
  is_live_enabled: boolean;
  lessons_total: number;
  level: string;
  modules_count: number;
  published_at: string | null;
  slug: string;
  teacher_display_name: string | null;
  title: string;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event) ?? new Headers();

  const upstream = await proxyJsonRequest<UpstreamPublicCourseCard[]>(event, {
    headers,
    method: "GET",
    url: `${resolveServiceBaseUrl(runtimeConfig.courseServiceBaseUrl, "http://localhost:8001")}/v1/public/courses`
  });

  if (!Array.isArray(upstream)) {
    return upstream;
  }

  return {
    items: upstream.map((item) => ({
      description: item.description,
      id: item.slug,
      lessonsCount: item.lessons_total,
      level: item.level,
      title: item.title
    }))
  };
});
