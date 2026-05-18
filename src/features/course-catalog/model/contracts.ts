import type { CourseCardItem, CourseDetailsItem } from "~/features/course-catalog/model/types";

export interface CourseCatalogResponse {
  items: CourseCardItem[];
}

export interface CourseDetailsResponse {
  item: CourseDetailsItem;
}
