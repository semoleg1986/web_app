<template>
  <section class="catalog">
    <h2>{{ t("catalog.title") }}</h2>
    <ul v-if="courses.length > 0" class="grid">
      <AppCard v-for="course in courses" :key="course.id" tag="li" class="card">
        <h3>
          <NuxtLink class="card-link" :to="courseHref(course)" no-prefetch>
            {{ course.title }}
          </NuxtLink>
        </h3>
        <p>
          {{ t("catalog.level") }}: {{ t(`catalog.level.${normalizeCourseLevel(course.level)}`) }}
        </p>
        <p>{{ t("catalog.lessons") }}: {{ course.lessonsCount }}</p>
        <p>{{ t("catalog.price") }}: {{ formatPrice(course.offer.price) }}</p>
        <p>{{ t("catalog.offers") }}: {{ course.offersCount }}</p>
        <NuxtLink class="open-link" :to="courseHref(course)" no-prefetch>
          {{ t("catalog.open") }}
        </NuxtLink>
      </AppCard>
    </ul>
    <p v-else-if="pending" class="empty">Loading courses...</p>
    <p v-else class="empty">{{ t("catalog.empty") }}</p>
  </section>
</template>

<script setup lang="ts">
import type { CourseCardItem } from "~/features/course-catalog/model/types";
import { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";
import { resolveCourseRouteId } from "~/features/course-catalog/model/resolve-course-route-id";
import { formatMoney } from "~/shared/lib/formatting/format-money";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppCard from "~/shared/ui/app-card/AppCard.vue";

defineProps<{
  courses: CourseCardItem[];
  pending?: boolean;
}>();

const { t } = usePreferences();

const formatPrice = (price: CourseCardItem["offer"]["price"]) =>
  formatMoney(price.salePrice, price.currency);

const courseHref = (course: CourseCardItem) =>
  `/courses/${resolveCourseRouteId(course.id, course.courseId)}`;
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

@media (max-width: 767px) {
  .catalog {
    height: auto;
  }

  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
