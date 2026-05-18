import { useCourseCatalogQuery } from "~/features/course-catalog/api/use-course-catalog-query";

export function useCourseCatalog() {
  const { data, error, pending, refresh } = useCourseCatalogQuery();
  const courses = computed(() => data.value?.items ?? []);

  return {
    courses,
    data,
    error,
    pending,
    refresh
  };
}
