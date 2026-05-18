<template>
  <main class="course-page">
    <AppShellSection class="course-page__sidebar" scroll="hidden">
      <template #header>
        <div class="course-page__nav">
          <NuxtLink class="back-link" to="/">{{ t("course.back") }}</NuxtLink>
          <p class="course-page__label">{{ t("catalog.title") }}</p>
        </div>
      </template>

      <div class="course-page__summary">
        <h1>{{ course.title }}</h1>
        <p>{{ t(`catalog.level.${normalizeCourseLevel(course.level)}`) }}</p>
        <strong>{{ t("catalog.lessons") }}: {{ course.lessonsCount }}</strong>
        <strong v-if="course.defaultOffer">
          {{ t("catalog.price") }}: {{ formatPrice(course.defaultOffer.price) }}
        </strong>
      </div>

      <CourseCheckoutCard :course="course" />
    </AppShellSection>

    <AppShellSection class="course-page__content" :title="t('course.description')">
      <CourseDetailsCard :course="course" />
    </AppShellSection>
  </main>
</template>

<script setup lang="ts">
import { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";
import { CourseCheckoutCard } from "~/features/course-checkout";
import { CourseDetailsCard } from "~/features/course-catalog";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppShellSection from "~/shared/ui/app-shell-section/AppShellSection.vue";
import { useCourseDetailsPage } from "~/widgets/course-details-page/model/use-course-details-page";

const { t } = usePreferences();
const { course, courseSchema, courseTitle, courseUrl, formatPrice } = await useCourseDetailsPage();

useSeoMeta({
  title: courseTitle,
  description: () => course.value.description,
  ogTitle: courseTitle,
  ogDescription: () => course.value.description,
  ogType: "website",
  ogUrl: courseUrl,
  twitterTitle: courseTitle,
  twitterDescription: () => course.value.description
});

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
  max-width: 1260px;
  height: 100%;
  min-height: 0;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(18rem, 22rem) minmax(0, 1fr);
}

.back-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  color: inherit;
  text-decoration: none;
}

.course-page__sidebar,
.course-page__content {
  min-height: 0;
}

.course-page__nav {
  display: grid;
  gap: 0.45rem;
}

.course-page__label {
  margin: 0;
  color: var(--c-muted);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.course-page__summary {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.course-page__summary h1,
.course-page__summary p,
.course-page__summary strong {
  margin: 0;
}

@media (max-width: 1023px) {
  .course-page {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .course-page {
    padding: 0.75rem 0.75rem 0;
    gap: 0.75rem;
  }
}
</style>
