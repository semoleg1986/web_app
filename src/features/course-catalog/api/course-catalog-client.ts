import { useApiClient } from "~/shared/api/use-api-client";

export interface CourseCatalogEntry {
  description: string | null;
  id: string;
  lessonsCount: number;
  level: string;
  title: string;
}

export interface CourseCatalogResponse {
  items: CourseCatalogEntry[];
}

export interface CourseDetailsResponse {
  item: CourseCatalogEntry;
}

export function useCourseCatalogClient() {
  const api = useApiClient();

  return {
    getCourse(courseId: string) {
      return api.get<CourseDetailsResponse>(`/courses/${courseId}`);
    },
    listCourses() {
      return api.get<CourseCatalogResponse>("/courses");
    }
  };
}
