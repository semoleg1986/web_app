<template>
  <AppCard tag="section" tone="hero" class="hero">
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from "~/shared/ui/app-card/AppCard.vue";

defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<style scoped>
.hero {
  padding: 2rem 1rem;
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
}

p {
  margin: 0;
  color: var(--c-muted);
}
</style>
