<template>
  <CourseDetailsPageWidget />
</template>

<script setup lang="ts">
import { definePageMeta } from "#imports";
import { CourseDetailsPageWidget } from "~/widgets/course-details-page";

definePageMeta({
  middleware: ["validate-course-route"]
});
</script>
