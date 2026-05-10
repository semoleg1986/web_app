<template>
  <AppCard class="course-card">
    <h1>{{ course.title }}</h1>
    <p>{{ t("catalog.level") }}: {{ t(`catalog.level.${normalizeCourseLevel(course.level)}`) }}</p>
    <p>{{ t("catalog.lessons") }}: {{ course.lessonsCount }}</p>
    <h2>{{ t("course.description") }}</h2>
    <p class="description">{{ course.description }}</p>
  </AppCard>
</template>

<script setup lang="ts">
import { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";
import type { CourseDetailsItem } from "~/features/course-catalog/model/types";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppCard from "~/shared/ui/app-card/AppCard.vue";

defineProps<{
  course: CourseDetailsItem;
}>();

const { t } = usePreferences();
</script>

<style scoped>
.course-card {
  padding: 1.25rem;
  min-height: 100%;
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
