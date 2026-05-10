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

          <button type="button" class="header__button header__button--ghost" :disabled="pending" @click="handleLogout">
            {{ pending ? t("auth.loading") : t("auth.logout") }}
          </button>
        </div>

        <div v-else class="header__guest">
          <button type="button" class="header__button header__button--ghost" @click="open('login')">
            {{ t("auth.login.title") }}
          </button>
          <button type="button" class="header__button" @click="open('register')">
            {{ t("auth.register.title") }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAuthPanel && !user" class="header__panel">
      <AuthPanel :mode-value="authPanelMode" @close="showAuthPanel = false" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import { useAuthSession } from "~/features/auth/model/use-auth-session";
import AuthPanel from "~/features/auth/ui/AuthPanel.vue";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

const authPanelMode = ref<"login" | "register">("login");
const showAuthPanel = ref(false);

const { logout, pending, user } = useAuthSession();
const { t } = usePreferences();

async function handleLogout() {
  await logout();
  showAuthPanel.value = false;
}

function open(mode: "login" | "register") {
  authPanelMode.value = mode;
  showAuthPanel.value = true;
}

watch(user, (nextUser) => {
  if (nextUser) {
    showAuthPanel.value = false;
  }
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

.header__button {
  border: none;
  border-radius: 999px;
  background: var(--c-accent);
  color: white;
  padding: 0.7rem 1rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.header__button--ghost {
  border: 1px solid var(--c-border);
  background: transparent;
  color: var(--c-fg);
}

.header__panel {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 1rem 1rem;
  display: flex;
  justify-content: flex-end;
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

  .header__actions,
  .header__panel {
    width: 100%;
  }

  .header__identity,
  .header__roles {
    text-align: left;
    justify-content: flex-start;
  }
}
</style>
