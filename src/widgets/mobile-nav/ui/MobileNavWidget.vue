<template>
  <nav class="mobile-nav" aria-label="Mobile navigation">
    <div class="mobile-nav__surface">
      <NuxtLink
        class="mobile-nav__item"
        :class="{ 'mobile-nav__item--active': route.path === '/' }"
        :aria-current="route.path === '/' ? 'page' : undefined"
        to="/"
      >
        <svg class="mobile-nav__icon" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 10.6 12 4l8 6.6V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.4Z" />
        </svg>
        <span>{{ t("nav.home") }}</span>
      </NuxtLink>

      <button type="button" class="mobile-nav__item" @click="handleAccount">
        <svg class="mobile-nav__icon" aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M12 12.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm-7.2 8.6a7.2 7.2 0 0 1 14.4 0H4.8Z"
          />
        </svg>
        <span>{{ user ? t("nav.account") : t("nav.login") }}</span>
      </button>
    </div>
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
    position: fixed;
    right: 0;
    bottom: max(0.7rem, env(safe-area-inset-bottom));
    left: 0;
    z-index: 40;
    display: flex;
    justify-content: center;
    padding: 0 0.75rem;
    pointer-events: none;
  }

  .mobile-nav__surface {
    width: min(100%, 23rem);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.25rem;
    padding: 0.35rem;
    border: 1px solid color-mix(in srgb, var(--c-border) 78%, transparent);
    border-radius: 1.35rem;
    background: color-mix(in srgb, var(--c-surface) 88%, transparent);
    box-shadow: 0 1rem 2.5rem color-mix(in srgb, #0a1a1f 24%, transparent);
    backdrop-filter: blur(18px) saturate(1.2);
    pointer-events: auto;
  }

  .mobile-nav__item {
    border: none;
    border-radius: 1rem;
    background: transparent;
    color: var(--c-muted);
    text-decoration: none;
    padding: 0.55rem 0.75rem;
    display: grid;
    gap: 0.2rem;
    justify-items: center;
    font: inherit;
    font-size: 0.72rem;
    font-weight: 800;
    line-height: 1;
    cursor: pointer;
    transition:
      background 160ms ease,
      color 160ms ease,
      transform 160ms ease;
  }

  .mobile-nav__item--active {
    background: color-mix(in srgb, var(--c-accent) 14%, transparent);
    color: var(--c-fg);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 24%, transparent);
  }

  .mobile-nav__item:active {
    transform: scale(0.97);
  }

  .mobile-nav__icon {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
  }
}
</style>
