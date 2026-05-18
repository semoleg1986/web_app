import { useCourseDetailsQuery } from "~/features/course-catalog/api/use-course-details-query";

export function useCourseDetails(slug: string) {
  const { data, error, pending, refresh } = useCourseDetailsQuery(slug);

  if (error.value && !pending.value) {
    throw createError({ statusCode: 404, statusMessage: "Course not found" });
  }

  const course = computed(() => data.value?.item ?? null);

  return {
    course,
    data,
    error,
    pending,
    refresh
  };
}
