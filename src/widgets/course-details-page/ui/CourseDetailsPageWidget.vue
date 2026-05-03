<template>
  <main class="course-page">
    <NuxtLink class="back-link" to="/">{{ t("course.back") }}</NuxtLink>
    <CourseDetailsCard :course="course" />
  </main>
</template>

<script setup lang="ts">
import { CourseDetailsCard } from "~/features/course-catalog";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import { useCourseDetailsPage } from "~/widgets/course-details-page/model/use-course-details-page";

const { t } = usePreferences();
const { course } = await useCourseDetailsPage();
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
</style>
