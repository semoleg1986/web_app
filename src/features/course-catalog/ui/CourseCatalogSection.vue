<template>
  <section class="catalog">
    <h2>{{ t("catalog.title") }}</h2>
    <ul v-if="courses.length > 0" class="grid">
      <li v-for="course in courses" :key="course.id" class="card">
        <h3>
          <NuxtLink class="card-link" :to="`/courses/${course.id}`">{{ course.title }}</NuxtLink>
        </h3>
        <p>{{ t("catalog.level") }}: {{ t(`catalog.level.${normalizeCourseLevel(course.level)}`) }}</p>
        <p>{{ t("catalog.lessons") }}: {{ course.lessonsCount }}</p>
        <NuxtLink class="open-link" :to="`/courses/${course.id}`">{{ t("catalog.open") }}</NuxtLink>
      </li>
    </ul>
    <p v-else class="empty">{{ t("catalog.empty") }}</p>
  </section>
</template>

<script setup lang="ts">
import { useCourseCatalogQuery } from "~/features/course-catalog/api/use-course-catalog-query";
import { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

const { data } = await useCourseCatalogQuery();
const { t } = usePreferences();
const courses = computed(() => data.value?.items ?? []);
</script>

<style scoped>
.catalog {
  margin-top: 2rem;
}

.grid {
  list-style: none;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  padding: 0;
}

.card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 12px;
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
