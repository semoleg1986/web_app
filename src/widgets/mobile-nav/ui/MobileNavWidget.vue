<template>
  <nav class="mobile-nav" aria-label="Mobile navigation">
    <NuxtLink class="mobile-nav__item" :class="{ 'mobile-nav__item--active': route.path === '/' }" to="/">
      <span class="mobile-nav__icon">⌂</span>
      <span>{{ t("nav.home") }}</span>
    </NuxtLink>

    <button type="button" class="mobile-nav__item" @click="handleAccount">
      <span class="mobile-nav__icon">{{ user ? "●" : "○" }}</span>
      <span>{{ user ? t("nav.account") : t("nav.login") }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useAuthSession } from "~/features/auth";
import { useAuthPanel } from "~/features/auth/model/use-auth-panel";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

const route = useRoute();
const { user } = useAuthSession();
const { openLogin } = useAuthPanel();
const { t } = usePreferences();

function handleAccount() {
  if (user.value) {
    return;
  }

  openLogin();
}
</script>

<style scoped>
.mobile-nav {
  display: none;
}

@media (max-width: 767px) {
  .mobile-nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 0.85rem 1rem calc(0.85rem + env(safe-area-inset-bottom));
    border-top: 1px solid color-mix(in srgb, var(--c-border) 84%, transparent);
    background: color-mix(in srgb, var(--c-surface) 92%, transparent);
    backdrop-filter: blur(16px);
  }

  .mobile-nav__item {
    border: none;
    border-radius: 1rem;
    background: color-mix(in srgb, var(--c-accent) 10%, transparent);
    color: var(--c-fg);
    text-decoration: none;
    padding: 0.75rem 0.9rem;
    display: grid;
    gap: 0.18rem;
    justify-items: center;
    font: inherit;
    font-size: 0.82rem;
  }

  .mobile-nav__item--active {
    background: color-mix(in srgb, var(--c-accent) 18%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 34%, transparent);
  }

  .mobile-nav__icon {
    font-size: 1rem;
  }
}
</style>
