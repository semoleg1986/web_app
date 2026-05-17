import { useApiQuery } from "~/shared/api/use-api-query";
import type { CourseDetailsItem } from "~/features/course-catalog/model/types";

interface CourseDetailsResponse {
  item: CourseDetailsItem;
}

export function useCourseDetailsQuery(slug: string) {
  return useApiQuery<CourseDetailsResponse>(`/courses/${slug}`);
}
