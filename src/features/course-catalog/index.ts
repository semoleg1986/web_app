export { useCourseCatalogClient } from "~/features/course-catalog/api/course-catalog-client";
export { useCourseCatalogQuery } from "~/features/course-catalog/api/use-course-catalog-query";
export { useCourseDetailsQuery } from "~/features/course-catalog/api/use-course-details-query";
export { useCourseCatalog } from "~/features/course-catalog/model/use-course-catalog";
export { useCourseDetails } from "~/features/course-catalog/model/use-course-details";
export { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";
export type { CourseCardItem, CourseDetailsItem } from "~/features/course-catalog/model/types";
export { default as CourseCatalogSection } from "~/features/course-catalog/ui/CourseCatalogSection.vue";
export { default as CourseDetailsCard } from "~/features/course-catalog/ui/CourseDetailsCard.vue";
