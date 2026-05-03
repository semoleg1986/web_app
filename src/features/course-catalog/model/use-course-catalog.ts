import { useCourseCatalogQuery } from "~/features/course-catalog/api/use-course-catalog-query";

export async function useCourseCatalog() {
  const { data, error, pending, refresh } = await useCourseCatalogQuery();
  const courses = computed(() => data.value?.items ?? []);

  return {
    courses,
    data,
    error,
    pending,
    refresh
  };
}
