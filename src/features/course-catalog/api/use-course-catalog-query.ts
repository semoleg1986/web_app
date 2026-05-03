import { useApiQuery } from "~/shared/api/use-api-query";
import type { CourseCardItem } from '~/features/course-catalog/model/types';

interface CoursesResponse {
  items: CourseCardItem[];
}

export function useCourseCatalogQuery() {
  return useApiQuery<CoursesResponse>("/courses");
}
