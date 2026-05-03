import { useCourseCatalog } from "~/features/course-catalog";
import { useHealthQuery } from "~/shared/api/health";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import { buildCourseTitle } from "~/shared/lib/seo/build-course-title";

export async function useHomePage() {
  const { t } = usePreferences();
  const runtimeConfig = useRuntimeConfig();

  const title = computed(() => buildCourseTitle(t("page.hero.title")));
  const siteUrl = computed(() => String(runtimeConfig.public.siteUrl || "http://localhost:3000"));

  useSeoMeta({
    title,
    description: "Образовательная платформа с курсами, уроками и live-классами.",
    ogTitle: title,
    ogDescription: "Образовательная платформа для детей, родителей и учителей."
  });

  const { data: health } = await useHealthQuery();
  const status = computed(() => (health.value?.ok ? "ok" : "degraded"));
  const { courses } = await useCourseCatalog();

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

  useHead(() => ({
    script: [
      {
        id: "ld-json-home",
        type: "application/ld+json",
        textContent: JSON.stringify(homeSchema.value)
      }
    ]
  }));

  return {
    courses,
    status,
    t
  };
}
