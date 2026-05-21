export function resolveCourseRouteId(slug: string | null | undefined, courseId: string) {
  const normalizedSlug = String(slug ?? "").trim();

  if (normalizedSlug.length > 0 && normalizedSlug !== "null" && normalizedSlug !== "undefined") {
    return normalizedSlug;
  }

  return courseId;
}
