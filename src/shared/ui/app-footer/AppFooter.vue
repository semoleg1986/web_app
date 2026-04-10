<template>
  <footer class="footer">
    <div class="footer__main">
      <div class="footer__brand">
        <strong>{{ t('app.name') }}</strong>
        <span>© {{ year }} {{ t('footer.copyright') }}</span>
      </div>

      <div class="footer__controls">
        <div class="control">
          <span class="control__label">{{ t('footer.language') }}</span>
          <div class="chip-group">
            <button
              v-for="code in locales"
              :key="code"
              type="button"
              class="chip"
              :class="{ 'chip--active': locale === code }"
              @click="setLocale(code)"
            >
              {{ code.toUpperCase() }}
            </button>
          </div>
        </div>

        <div class="control">
          <span class="control__label">{{ t('footer.theme') }}</span>
          <div class="chip-group">
            <button
              type="button"
              class="chip"
              :class="{ 'chip--active': themeMode === 'system' }"
              @click="setThemeMode('system')"
            >
              {{ t('footer.theme.system') }}
            </button>
            <button
              type="button"
              class="chip"
              :class="{ 'chip--active': themeMode === 'light' }"
              @click="setThemeMode('light')"
            >
              {{ t('footer.theme.light') }}
            </button>
            <button
              type="button"
              class="chip"
              :class="{ 'chip--active': themeMode === 'dark' }"
              @click="setThemeMode('dark')"
            >
              {{ t('footer.theme.dark') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { LocaleCode } from '~/shared/lib/preferences/types';
import { usePreferences } from '~/shared/lib/preferences/use-preferences';

const locales: LocaleCode[] = ['ru', 'en'];
const year = new Date().getFullYear();

const { locale, themeMode, setLocale, setThemeMode, t } = usePreferences();
</script>

<style scoped>
.footer {
  margin-top: 2.5rem;
  border-top: 1px solid var(--c-border);
  background: var(--c-footer-bg);
}

.footer__main {
  max-width: 1080px;
  margin: 0 auto;
  padding: 1.2rem 1rem 1.6rem;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: var(--c-muted);
}

.footer__controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.control {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.control__label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--c-muted);
}

.chip-group {
  display: inline-flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.chip {
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: var(--c-surface);
  color: var(--c-fg);
  padding: 0.35rem 0.75rem;
  font-size: 0.82rem;
  cursor: pointer;
}

.chip--active {
  border-color: var(--c-accent);
  box-shadow: inset 0 0 0 1px var(--c-accent);
}
</style>
