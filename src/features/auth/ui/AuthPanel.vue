<template>
  <section class="auth-panel">
    <div class="auth-panel__tabs" role="tablist" :aria-label="t('auth.panel.label')">
      <button
        type="button"
        class="auth-panel__tab"
        :class="{ 'auth-panel__tab--active': mode === 'login' }"
        @click="mode = 'login'"
      >
        {{ t("auth.login.title") }}
      </button>
      <button
        type="button"
        class="auth-panel__tab"
        :class="{ 'auth-panel__tab--active': mode === 'register' }"
        @click="mode = 'register'"
      >
        {{ t("auth.register.title") }}
      </button>
    </div>

    <form v-if="mode === 'login'" class="auth-form" @submit.prevent="submitLogin">
      <label class="auth-form__field">
        <span>{{ t("auth.email") }}</span>
        <input v-model.trim="loginForm.email" type="email" autocomplete="email" required />
      </label>

      <label class="auth-form__field">
        <span>{{ t("auth.password") }}</span>
        <input
          v-model="loginForm.password"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>

      <p v-if="errorMessage" class="auth-form__error">{{ errorMessage }}</p>

      <button class="auth-form__submit" type="submit" :disabled="pending">
        {{ pending ? t("auth.loading") : t("auth.login.submit") }}
      </button>
    </form>

    <form v-else class="auth-form" @submit.prevent="submitRegister">
      <label class="auth-form__field">
        <span>{{ t("auth.email") }}</span>
        <input v-model.trim="registerForm.email" type="email" autocomplete="email" required />
      </label>

      <label class="auth-form__field">
        <span>{{ t("auth.password") }}</span>
        <input
          v-model="registerForm.password"
          type="password"
          autocomplete="new-password"
          required
        />
      </label>

      <label class="auth-form__field">
        <span>{{ t("auth.register.role") }}</span>
        <select v-model="registerForm.default_role">
          <option value="parent">{{ t("auth.role.parent") }}</option>
          <option value="student">{{ t("auth.role.student") }}</option>
        </select>
      </label>

      <p v-if="errorMessage" class="auth-form__error">{{ errorMessage }}</p>

      <button class="auth-form__submit" type="submit" :disabled="pending">
        {{ pending ? t("auth.loading") : t("auth.register.submit") }}
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";

import type { AuthRole } from "~/features/auth/model/types";
import { useAuthSession } from "~/features/auth/model/use-auth-session";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

const props = withDefaults(
  defineProps<{
    modeValue?: "login" | "register";
  }>(),
  {
    modeValue: "login"
  }
);

const emit = defineEmits<{
  close: [];
}>();

const mode = ref<"login" | "register">(props.modeValue);
const loginForm = reactive({
  email: "",
  password: ""
});
const registerForm = reactive<{
  default_role: AuthRole;
  email: string;
  password: string;
}>({
  default_role: "parent",
  email: "",
  password: ""
});

const { error, login, pending, register } = useAuthSession();
const { t } = usePreferences();

const errorMessage = computed(() => error.value?.statusMessage ?? null);

watch(
  () => props.modeValue,
  (nextMode) => {
    mode.value = nextMode;
  }
);

async function submitLogin() {
  await login({
    email: loginForm.email,
    password: loginForm.password
  });
  emit("close");
}

async function submitRegister() {
  await register({
    default_role: registerForm.default_role,
    email: registerForm.email,
    password: registerForm.password
  });

  await login({
    email: registerForm.email,
    password: registerForm.password
  });

  emit("close");
}
</script>

<style scoped>
.auth-panel {
  min-width: min(100%, 21rem);
  padding: 1rem;
  border: 1px solid var(--c-border);
  border-radius: 1rem;
  background: var(--c-surface);
  box-shadow: 0 24px 60px rgba(16, 33, 41, 0.12);
}

.auth-panel__tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.auth-panel__tab {
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: transparent;
  color: var(--c-muted);
  padding: 0.6rem 0.8rem;
  font: inherit;
  cursor: pointer;
}

.auth-panel__tab--active {
  border-color: var(--c-accent);
  color: var(--c-fg);
  box-shadow: inset 0 0 0 1px var(--c-accent);
}

.auth-form {
  display: grid;
  gap: 0.85rem;
}

.auth-form__field {
  display: grid;
  gap: 0.35rem;
  font-size: 0.92rem;
}

.auth-form__field input,
.auth-form__field select {
  border: 1px solid var(--c-border);
  border-radius: 0.85rem;
  background: var(--c-bg);
  color: var(--c-fg);
  padding: 0.8rem 0.9rem;
  font: inherit;
}

.auth-form__error {
  margin: 0;
  color: #ba3b46;
  font-size: 0.9rem;
}

.auth-form__submit {
  border: none;
  border-radius: 999px;
  background: var(--c-accent);
  color: white;
  padding: 0.8rem 1rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.auth-form__submit:disabled {
  opacity: 0.65;
  cursor: wait;
}
</style>
