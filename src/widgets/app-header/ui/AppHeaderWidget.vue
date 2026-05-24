<template>
  <header class="header">
    <div class="header__main">
      <NuxtLink class="header__brand" to="/">
        <span class="header__brand-mark">C</span>
        <div>
          <strong>{{ t("app.name") }}</strong>
          <p>{{ t("auth.header.subtitle") }}</p>
        </div>
      </NuxtLink>

      <div class="header__actions">
        <div v-if="user" class="header__session">
          <div class="header__identity">
            <strong>{{ user.email }}</strong>
            <div class="header__roles">
              <span v-for="role in user.roles" :key="role" class="header__role">
                {{ t(`auth.role.${role}`) }}
              </span>
            </div>
          </div>

          <AppButton variant="ghost" :disabled="pending" @click="handleLogout">
            {{ pending ? t("auth.loading") : t("auth.logout") }}
          </AppButton>
        </div>

        <div v-else class="header__guest">
          <AppButton variant="ghost" @click="openLogin">
            {{ t("auth.login.title") }}
          </AppButton>
          <AppButton @click="openRegister">
            {{ t("auth.register.title") }}
          </AppButton>
        </div>
      </div>
    </div>

    <div
      v-if="authPanelOpen && !user"
      class="auth-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="t('auth.panel.label')"
      @click.self="closePanel"
    >
      <div class="auth-modal__content" @click.stop>
        <button
          type="button"
          class="auth-modal__close"
          :aria-label="t('auth.modal.close')"
          @click="closePanel"
        >
          ×
        </button>
        <AuthPanel :mode-value="authPanelMode" @close="closePanel" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";

import { useAuthPanel, useAuthSession } from "~/features/auth";
import AuthPanel from "~/features/auth/ui/AuthPanel.vue";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppButton from "~/shared/ui/app-button/AppButton.vue";

const { logout, pending, user } = useAuthSession();
const {
  closePanel,
  mode: authPanelMode,
  open: authPanelOpen,
  openLogin,
  openRegister
} = useAuthPanel();
const { t } = usePreferences();

async function handleLogout() {
  await logout();
  closePanel();
}

watch(user, (nextUser) => {
  if (nextUser) {
    closePanel();
  }
});

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape" && authPanelOpen.value) {
    closePanel();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: color-mix(in srgb, var(--c-bg) 86%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--c-border) 84%, transparent);
}

.header__main {
  max-width: 1080px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.header__brand {
  display: flex;
  gap: 0.85rem;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

.header__brand p {
  margin: 0.15rem 0 0;
  color: var(--c-muted);
  font-size: 0.88rem;
}

.header__brand-mark {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.8rem;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--c-accent), #ef8f54);
  color: white;
  font-weight: 700;
}

.header__actions {
  display: flex;
  align-items: center;
}

.header__guest,
.header__session {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.header__identity {
  display: grid;
  gap: 0.35rem;
  text-align: right;
}

.header__roles {
  display: flex;
  gap: 0.35rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.header__role {
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--c-accent) 16%, transparent);
  color: var(--c-fg);
  font-size: 0.76rem;
}

.auth-modal {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: color-mix(in srgb, var(--c-bg) 30%, #02070a 70%);
  backdrop-filter: blur(8px);
}

.auth-modal__content {
  width: min(100%, 25rem);
  position: relative;
}

.auth-modal__close {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 1.9rem;
  height: 1.9rem;
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: var(--c-surface);
  color: var(--c-fg);
  font-size: 1.15rem;
  line-height: 1;
  cursor: pointer;
}

@media (max-width: 720px) {
  .header__main,
  .header__guest,
  .header__session {
    align-items: stretch;
    flex-direction: column;
  }

  .header__main {
    padding-bottom: 0.8rem;
  }

  .header__actions {
    width: 100%;
  }

  .header__identity,
  .header__roles {
    text-align: left;
    justify-content: flex-start;
  }
}

@media (max-width: 767px) {
  .header {
    position: relative;
  }

  .auth-modal {
    align-items: end;
    padding: 0.75rem;
  }
}
</style>
