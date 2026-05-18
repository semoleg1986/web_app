import { useCourseCatalogQuery } from "~/features/course-catalog/api/use-course-catalog-query";
import type { CourseCardItem } from "~/features/course-catalog/model/types";
import { useHealthQuery } from "~/shared/api/health";
import { buildCourseTitle } from "~/shared/lib/seo/build-course-title";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

export function useHomePage() {
  const { t } = usePreferences();
  const runtimeConfig = useRuntimeConfig();
  const siteUrl = computed(() => String(runtimeConfig.public.siteUrl || "http://localhost:3000"));
  const title = computed(() => buildCourseTitle(t("page.hero.title")));
  const catalogCache = useState<CourseCardItem[]>("home-course-catalog-cache", () => []);

  const { data: health } = useHealthQuery();
  const { data: catalog, pending: catalogPending } = useCourseCatalogQuery();

  watch(
    catalog,
    (value) => {
      if (Array.isArray(value?.items) && value.items.length > 0) {
        catalogCache.value = value.items;
      }
    },
    { immediate: true }
  );

  const courses = computed<CourseCardItem[]>(() => catalog.value?.items ?? catalogCache.value);
  const status = computed(() => (health.value?.ok ? "ok" : "degraded"));
  const homeSchema = computed(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl.value}/#website`,
        url: siteUrl.value,
        name: runtimeConfig.public.appName
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl.value}/#org`,
        url: siteUrl.value,
        name: runtimeConfig.public.appName
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl.value}/#course-list`,
        itemListElement: courses.value.map((course, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl.value}/courses/${course.id}`,
          name: course.title
        }))
      }
    ]
  }));

  return {
    courses,
    catalogPending,
    homeSchema,
    status,
    title,
    t
  };
}
