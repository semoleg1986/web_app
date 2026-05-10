<template>
  <label class="app-form-field">
    <span class="app-form-field__label">{{ label }}</span>
    <slot />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<style scoped>
.app-form-field {
  display: grid;
  gap: 0.35rem;
  font-size: 0.92rem;
}

.app-form-field__label {
  color: var(--c-fg);
}

.app-form-field :deep(input),
.app-form-field :deep(select),
.app-form-field :deep(textarea) {
  border: 1px solid var(--c-border);
  border-radius: 0.85rem;
  background: var(--c-bg);
  color: var(--c-fg);
  padding: 0.8rem 0.9rem;
  font: inherit;
}
</style>
