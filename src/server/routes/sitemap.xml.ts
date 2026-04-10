import { COURSES } from "~/server/data/courses";

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event);
  const siteUrl = String(runtimeConfig.public.siteUrl || "http://localhost:3000");

  setHeader(event, "Content-Type", "application/xml; charset=utf-8");

  const staticPaths = ["/"];
  const coursePaths = COURSES.map((course) => `/courses/${course.id}`);

  const urls = [...staticPaths, ...coursePaths].map((path) => `<url><loc>${siteUrl}${path}</loc></url>`);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>"
  ].join("");
});
