<template>
  <main class="course-page">
    <NuxtLink class="back-link" to="/">{{ t("course.back") }}</NuxtLink>
    <article class="course-card">
      <h1>{{ course.title }}</h1>
      <p>{{ t("catalog.level") }}: {{ t(`catalog.level.${normalizeCourseLevel(course.level)}`) }}</p>
      <p>{{ t("catalog.lessons") }}: {{ course.lessonsCount }}</p>
      <h2>{{ t("course.description") }}</h2>
      <p class="description">{{ course.description }}</p>
    </article>
  </main>
</template>

<script setup lang="ts">
import { useCourseDetailsQuery } from "~/features/course-catalog/api/use-course-details-query";
import { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import { buildCourseTitle } from "~/shared/lib/seo/build-course-title";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { t } = usePreferences();

const routeParam = route.params.id;
const courseId = Array.isArray(routeParam) ? routeParam[0] : routeParam;

if (!courseId) {
  throw createError({ statusCode: 404, statusMessage: "Course not found" });
}

const { data: courseResponse, error } = await useCourseDetailsQuery(courseId);

if (error.value || !courseResponse.value?.item) {
  throw createError({ statusCode: 404, statusMessage: "Course not found" });
}

const course = computed(() => courseResponse.value!.item);
const siteUrl = computed(() => String(runtimeConfig.public.siteUrl || "http://localhost:3000"));
const courseUrl = computed(() => `${siteUrl.value}/courses/${course.value.id}`);
const courseTitle = computed(() => buildCourseTitle(course.value.title));

useSeoMeta({
  title: courseTitle,
  description: () => course.value.description,
  ogTitle: courseTitle,
  ogDescription: () => course.value.description,
  ogType: "article",
  ogUrl: courseUrl,
  twitterTitle: courseTitle,
  twitterDescription: () => course.value.description
});

const courseSchema = computed(() => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: runtimeConfig.public.appName,
          item: siteUrl.value
        },
        {
          "@type": "ListItem",
          position: 2,
          name: course.value.title,
          item: courseUrl.value
        }
      ]
    },
    {
      "@type": "Course",
      name: course.value.title,
      url: courseUrl.value,
      description: course.value.description,
      educationalLevel: normalizeCourseLevel(course.value.level),
      provider: {
        "@type": "Organization",
        name: runtimeConfig.public.appName,
        url: siteUrl.value
      }
    }
  ]
}));

useHead(() => ({
  script: [
    {
      id: "ld-json-course",
      type: "application/ld+json",
      textContent: JSON.stringify(courseSchema.value)
    }
  ]
}));
</script>

<style scoped>
.course-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
}

.course-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 1.25rem;
}

h1 {
  margin: 0 0 0.8rem;
}

h2 {
  margin: 1rem 0 0.4rem;
  font-size: 1.1rem;
}

p {
  margin: 0.2rem 0;
}

.description {
  line-height: 1.5;
}
</style>
