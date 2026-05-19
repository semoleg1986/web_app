<template>
  <button class="app-chip" :class="{ 'app-chip--active': active }" :type="type">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    active?: boolean;
    type?: "button" | "submit";
  }>(),
  {
    active: false,
    type: "button"
  }
);
</script>

<style scoped>
.app-chip {
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: var(--c-surface);
  color: var(--c-fg);
  padding: 0.35rem 0.75rem;
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}

.app-chip--active {
  border-color: var(--c-accent);
  box-shadow: inset 0 0 0 1px var(--c-accent);
}
</style>
