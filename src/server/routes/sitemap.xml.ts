import { resolveServiceBaseUrl } from "~/server/utils/upstream-proxy";

interface PublicCourseSitemapItem {
  slug: string;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event);
  const siteUrl = String(runtimeConfig.public.siteUrl || "http://localhost:3000");
  const courseServiceBaseUrl = resolveServiceBaseUrl(
    runtimeConfig.courseServiceBaseUrl,
    "http://localhost:8001"
  );

  const coursesResponse = await fetch(`${courseServiceBaseUrl}/v1/public/courses`);
  const courses = coursesResponse.ok
    ? (((await coursesResponse.json()) as PublicCourseSitemapItem[]) ?? [])
    : [];

  setHeader(event, "Content-Type", "application/xml; charset=utf-8");

  const staticPaths = ["/"];
  const coursePaths = courses
    .filter((course) => typeof course.slug === "string" && course.slug.length > 0)
    .map((course) => `/courses/${course.slug}`);

  const urls = [...staticPaths, ...coursePaths].map((path) => `<url><loc>${siteUrl}${path}</loc></url>`);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>"
  ].join("");
});
