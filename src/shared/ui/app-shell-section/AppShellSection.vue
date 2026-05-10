<template>
  <AppCard class="shell-section" :class="`shell-section--${scroll}`" :tag="tag">
    <header v-if="title || $slots.header" class="shell-section__header">
      <slot name="header">
        <div>
          <p v-if="eyebrow" class="shell-section__eyebrow">{{ eyebrow }}</p>
          <h2 class="shell-section__title">{{ title }}</h2>
        </div>
      </slot>
    </header>

    <div class="shell-section__body">
      <slot />
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from "~/shared/ui/app-card/AppCard.vue";

withDefaults(
  defineProps<{
    eyebrow?: string;
    scroll?: "auto" | "hidden";
    tag?: string;
    title?: string;
  }>(),
  {
    eyebrow: "",
    scroll: "auto",
    tag: "section",
    title: ""
  }
);
</script>

<style scoped>
.shell-section {
  display: flex;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  padding: 1rem;
}

.shell-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.shell-section__eyebrow {
  margin: 0 0 0.3rem;
  color: var(--c-muted);
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.shell-section__title {
  margin: 0;
  font-size: 1.05rem;
}

.shell-section__body {
  min-height: 0;
  flex: 1;
}

.shell-section--auto .shell-section__body {
  overflow: auto;
}

.shell-section--hidden .shell-section__body {
  overflow: hidden;
}
</style>
