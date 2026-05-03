<template>
  <main class="page">
    <HeroBanner
      :title="t('page.hero.title')"
      :subtitle="t('page.hero.subtitle')"
    />
    <p class="status">{{ t("page.status") }}: {{ t(`status.${status}`) }}</p>
    <CourseCatalogSection :courses="courses" />
  </main>
</template>

<script setup lang="ts">
import { CourseCatalogSection } from "~/features/course-catalog";
import HeroBanner from "~/shared/ui/hero-banner/HeroBanner.vue";
import { useHomePage } from "~/widgets/home-page/model/use-home-page";

const { courses, status, t } = await useHomePage();
</script>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
}

.status {
  margin-top: 1rem;
  font-weight: 600;
}
</style>
