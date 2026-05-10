<template>
  <button
    class="app-button"
    :class="[
      `app-button--${variant}`,
      `app-button--${size}`,
      { 'app-button--block': block }
    ]"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    block?: boolean;
    disabled?: boolean;
    size?: "md" | "sm";
    type?: "button" | "submit";
    variant?: "ghost" | "primary";
  }>(),
  {
    block: false,
    disabled: false,
    size: "md",
    type: "button",
    variant: "primary"
  }
);
</script>

<style scoped>
.app-button {
  border: none;
  border-radius: 999px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 120ms ease,
    opacity 120ms ease,
    background 120ms ease,
    color 120ms ease,
    border-color 120ms ease;
}

.app-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.app-button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.app-button--primary {
  background: var(--c-accent);
  color: white;
}

.app-button--ghost {
  border: 1px solid var(--c-border);
  background: transparent;
  color: var(--c-fg);
}

.app-button--md {
  padding: 0.75rem 1rem;
}

.app-button--sm {
  padding: 0.38rem 0.8rem;
  font-size: 0.82rem;
}

.app-button--block {
  width: 100%;
}
</style>
