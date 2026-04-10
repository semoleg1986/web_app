import type { CourseCardItem } from '~/features/course-catalog/model/types';

interface CoursesResponse {
  items: CourseCardItem[];
}

export function useCourseCatalogQuery() {
  return useFetch<CoursesResponse>('/api/courses');
}
