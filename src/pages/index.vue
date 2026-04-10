<template>
  <main class="page">
    <HeroBanner
      :title="t('page.hero.title')"
      :subtitle="t('page.hero.subtitle')"
    />
    <p class="status">{{ t("page.status") }}: {{ t(`status.${status}`) }}</p>
    <CourseCatalogSection />
  </main>
</template>

<script setup lang="ts">
import type { CourseCardItem } from "~/features/course-catalog/model/types";
import CourseCatalogSection from "~/features/course-catalog/ui/CourseCatalogSection.vue";
import { useHealthQuery } from "~/shared/api/health";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import { buildCourseTitle } from "~/shared/lib/seo/build-course-title";
import HeroBanner from "~/shared/ui/hero-banner/HeroBanner.vue";

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

const { data } = await useHealthQuery();
const status = computed(() => (data.value?.ok ? "ok" : "degraded"));
const { data: coursesResponse } = await useFetch<{ items: CourseCardItem[] }>("/api/courses");

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
      itemListElement: (coursesResponse.value?.items ?? []).map((course, index) => ({
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
</script>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'IBM Plex Sans', 'Segoe UI', sans-serif;
}

.status {
  margin-top: 1rem;
  font-weight: 600;
}
</style>
