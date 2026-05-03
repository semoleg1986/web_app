import { useApiQuery } from "~/shared/api/use-api-query";
import type { CourseDetailsItem } from "~/features/course-catalog/model/types";

interface CourseDetailsResponse {
  item: CourseDetailsItem;
}

export function useCourseDetailsQuery(courseId: string) {
  return useApiQuery<CourseDetailsResponse>(`/courses/${courseId}`);
}
