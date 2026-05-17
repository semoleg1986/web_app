import type { CourseCardItem, CourseDetailsItem } from "~/features/course-catalog/model/types";
import { useApiClient } from "~/shared/api/use-api-client";

export interface CourseCatalogResponse {
  items: CourseCardItem[];
}

export interface CourseDetailsResponse {
  item: CourseDetailsItem;
}

export function useCourseCatalogClient() {
  const api = useApiClient();

  return {
    getCourse(slug: string) {
      return api.get<CourseDetailsResponse>(`/courses/${slug}`);
    },
    listCourses() {
      return api.get<CourseCatalogResponse>("/courses");
    }
  };
}
