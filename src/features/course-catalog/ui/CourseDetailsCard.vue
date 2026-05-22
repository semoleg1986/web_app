<template>
  <AppCard class="course-card">
    <h1>{{ course.title }}</h1>
    <p>{{ t("catalog.level") }}: {{ t(`catalog.level.${normalizeCourseLevel(course.level)}`) }}</p>
    <p>{{ t("catalog.lessons") }}: {{ course.lessonsCount }}</p>
    <div v-if="course.offers.length > 0" class="offers">
      <h2>{{ t("catalog.offers") }}</h2>
      <ul class="offers__list">
        <li v-for="offer in course.offers" :key="offer.offerId" class="offers__item">
          <strong>{{ offer.title }}</strong>
          <span>{{ formatPrice(offer.price) }}</span>
        </li>
      </ul>
    </div>
    <h2>{{ t("course.description") }}</h2>
    <p class="description">{{ course.description }}</p>
  </AppCard>
</template>

<script setup lang="ts">
import { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";
import type { CourseDetailsItem } from "~/features/course-catalog/model/types";
import { formatMoney } from "~/shared/lib/formatting/format-money";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppCard from "~/shared/ui/app-card/AppCard.vue";

defineProps<{
  course: CourseDetailsItem;
}>();

const { t } = usePreferences();

const formatPrice = (price: CourseDetailsItem["offers"][number]["price"]) =>
  formatMoney(price.salePrice, price.currency);
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

.offers {
  margin-top: 1rem;
}

.offers__list {
  list-style: none;
  display: grid;
  gap: 0.5rem;
  padding: 0;
}

.offers__item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
</style>
