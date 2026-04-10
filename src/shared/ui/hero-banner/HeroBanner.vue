<template>
  <section class="hero">
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<style scoped>
.hero {
  padding: 2rem 1rem;
  border-radius: 16px;
  background: linear-gradient(135deg, color-mix(in oklab, var(--c-surface), #f9f4e8 35%) 0%, color-mix(in oklab, var(--c-surface), #d6f0f0 50%) 100%);
  border: 1px solid var(--c-border);
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
