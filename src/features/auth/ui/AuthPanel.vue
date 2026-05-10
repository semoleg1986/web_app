<template>
  <section class="auth-panel">
    <div class="auth-panel__tabs" role="tablist" :aria-label="t('auth.panel.label')">
      <AppChip :active="mode === 'login'" @click="mode = 'login'">
        {{ t("auth.login.title") }}
      </AppChip>
      <AppChip :active="mode === 'register'" @click="mode = 'register'">
        {{ t("auth.register.title") }}
      </AppChip>
    </div>

    <form v-if="mode === 'login'" class="auth-form" @submit.prevent="submitLogin">
      <AppFormField :label="t('auth.email')">
        <input v-model.trim="loginForm.email" type="email" autocomplete="email" required />
      </AppFormField>

      <AppFormField :label="t('auth.password')">
        <input
          v-model="loginForm.password"
          type="password"
          autocomplete="current-password"
          required
        />
      </AppFormField>

      <p v-if="errorMessage" class="auth-form__error">{{ errorMessage }}</p>

      <AppButton block type="submit" :disabled="pending">
        {{ pending ? t("auth.loading") : t("auth.login.submit") }}
      </AppButton>
    </form>

    <form v-else class="auth-form" @submit.prevent="submitRegister">
      <AppFormField :label="t('auth.email')">
        <input v-model.trim="registerForm.email" type="email" autocomplete="email" required />
      </AppFormField>

      <AppFormField :label="t('auth.password')">
        <input
          v-model="registerForm.password"
          type="password"
          autocomplete="new-password"
          required
        />
      </AppFormField>

      <AppFormField :label="t('auth.register.role')">
        <select v-model="registerForm.default_role">
          <option value="parent">{{ t("auth.role.parent") }}</option>
          <option value="student">{{ t("auth.role.student") }}</option>
        </select>
      </AppFormField>

      <p v-if="errorMessage" class="auth-form__error">{{ errorMessage }}</p>

      <AppButton block type="submit" :disabled="pending">
        {{ pending ? t("auth.loading") : t("auth.register.submit") }}
      </AppButton>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";

import type { AuthRole } from "~/features/auth/model/types";
import { useAuthSession } from "~/features/auth/model/use-auth-session";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppButton from "~/shared/ui/app-button/AppButton.vue";
import AppChip from "~/shared/ui/app-chip/AppChip.vue";
import AppFormField from "~/shared/ui/app-form-field/AppFormField.vue";

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

.auth-form {
  display: grid;
  gap: 0.85rem;
}

.auth-form__error {
  margin: 0;
  color: #ba3b46;
  font-size: 0.9rem;
}
</style>
