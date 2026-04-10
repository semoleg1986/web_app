import type { CourseDetailsItem } from "~/features/course-catalog/model/types";

interface CourseDetailsResponse {
  item: CourseDetailsItem;
}

export function useCourseDetailsQuery(courseId: string) {
  return useFetch<CourseDetailsResponse>(`/api/courses/${courseId}`);
}
