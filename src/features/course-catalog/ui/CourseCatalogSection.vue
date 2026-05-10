<template>
  <section class="catalog">
    <h2>{{ t("catalog.title") }}</h2>
    <ul v-if="courses.length > 0" class="grid">
      <AppCard v-for="course in courses" :key="course.id" tag="li" class="card">
        <h3>
          <NuxtLink class="card-link" :to="`/courses/${course.id}`">{{ course.title }}</NuxtLink>
        </h3>
        <p>{{ t("catalog.level") }}: {{ t(`catalog.level.${normalizeCourseLevel(course.level)}`) }}</p>
        <p>{{ t("catalog.lessons") }}: {{ course.lessonsCount }}</p>
        <NuxtLink class="open-link" :to="`/courses/${course.id}`">{{ t("catalog.open") }}</NuxtLink>
      </AppCard>
    </ul>
    <p v-else class="empty">{{ t("catalog.empty") }}</p>
  </section>
</template>

<script setup lang="ts">
import type { CourseCardItem } from "~/features/course-catalog/model/types";
import { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppCard from "~/shared/ui/app-card/AppCard.vue";

defineProps<{
  courses: CourseCardItem[];
}>();

const { t } = usePreferences();
</script>

<style scoped>
.catalog {
  height: 100%;
}

.grid {
  list-style: none;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  padding: 0;
}

.card {
  padding: 1rem;
}

.card-link {
  color: inherit;
  text-decoration: none;
}

.card-link:hover {
  text-decoration: underline;
}

h3 {
  margin: 0 0 0.5rem;
}

p {
  margin: 0.2rem 0;
}

.empty {
  color: var(--c-muted);
}

.open-link {
  margin-top: 0.4rem;
  display: inline-block;
}
</style>
