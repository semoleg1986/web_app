<template>
  <component :is="tag" class="app-card" :class="`app-card--${tone}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string;
    tone?: "default" | "hero";
  }>(),
  {
    tag: "article",
    tone: "default"
  }
);
</script>

<style scoped>
.app-card {
  border: 1px solid var(--c-border);
  border-radius: 1rem;
}

.app-card--default {
  background: var(--c-surface);
}

.app-card--hero {
  background: linear-gradient(
    135deg,
    color-mix(in oklab, var(--c-surface), #f9f4e8 35%) 0%,
    color-mix(in oklab, var(--c-surface), #d6f0f0 50%) 100%
  );
}
</style>
