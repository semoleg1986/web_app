import { useApiQuery } from "~/shared/api/use-api-query";
import type { CourseDetailsResponse } from "~/features/course-catalog/model/contracts";

export function useCourseDetailsQuery(slug: string) {
  return useApiQuery<CourseDetailsResponse>(`/courses/${slug}`);
}
