<template>
  <main class="dashboard">
    <AppShellSection class="dashboard__hero" scroll="hidden">
      <HeroBanner
        :title="t('page.hero.title')"
        :subtitle="t('page.hero.subtitle')"
      />
      <div class="dashboard__status">
        <span class="dashboard__status-dot" :class="`dashboard__status-dot--${status}`" />
        <span>{{ t("page.status") }}: {{ t(`status.${status}`) }}</span>
      </div>
    </AppShellSection>

    <AppShellSection
      class="dashboard__catalog"
      :eyebrow="t('nav.home')"
      :title="t('catalog.title')"
    >
      <CourseCatalogSection :courses="courses" />
    </AppShellSection>
  </main>
</template>

<script setup lang="ts">
import { CourseCatalogSection } from "~/features/course-catalog";
import { useCourseCatalogQuery } from "~/features/course-catalog/api/use-course-catalog-query";
import AppShellSection from "~/shared/ui/app-shell-section/AppShellSection.vue";
import { useHealthQuery } from "~/shared/api/health";
import { buildCourseTitle } from "~/shared/lib/seo/build-course-title";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import HeroBanner from "~/shared/ui/hero-banner/HeroBanner.vue";
import type { CourseCardItem } from "~/features/course-catalog/model/types";

const { t } = usePreferences();
const runtimeConfig = useRuntimeConfig();
const siteUrl = computed(() => String(runtimeConfig.public.siteUrl || "http://localhost:3000"));
const title = computed(() => buildCourseTitle(t("page.hero.title")));

const { data: health } = await useHealthQuery();
const { data: catalog } = await useCourseCatalogQuery();

const courses = computed<CourseCardItem[]>(() => catalog.value?.items ?? []);
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

useSeoMeta({
  title,
  description: "Образовательная платформа с курсами, уроками и live-классами.",
  ogTitle: title,
  ogDescription: "Образовательная платформа для детей, родителей и учителей."
});

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
.dashboard {
  max-width: 1260px;
  height: 100%;
  min-height: 0;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(18rem, 24rem) minmax(0, 1fr);
}

.dashboard__hero,
.dashboard__catalog {
  min-height: 0;
}

.dashboard__status {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1rem;
  color: var(--c-muted);
  font-weight: 600;
}

.dashboard__status-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  background: #d0d9de;
}

.dashboard__status-dot--ok {
  background: #2fa36b;
}

.dashboard__status-dot--degraded {
  background: #d9842c;
}

@media (max-width: 1023px) {
  .dashboard {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .dashboard {
    padding: 0.75rem 0.75rem 0;
    gap: 0.75rem;
  }
}
</style>
