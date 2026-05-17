import { useCourseDetailsQuery } from "~/features/course-catalog/api/use-course-details-query";

export async function useCourseDetails(slug: string) {
  const { data, error, pending, refresh } = await useCourseDetailsQuery(slug);

  if (error.value || !data.value?.item) {
    throw createError({ statusCode: 404, statusMessage: "Course not found" });
  }

  const course = computed(() => data.value!.item);

  return {
    course,
    data,
    error,
    pending,
    refresh
  };
}
