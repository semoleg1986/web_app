import { useApiQuery } from "~/shared/api/use-api-query";
import type { CourseCatalogResponse } from "~/features/course-catalog/model/contracts";

export function useCourseCatalogQuery() {
  return useApiQuery<CourseCatalogResponse>("/courses");
}
