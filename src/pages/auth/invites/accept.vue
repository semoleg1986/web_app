<template>
  <main class="invite-page">
    <AppShellSection class="invite-page__panel" :title="t('auth.invite.title')">
      <form class="invite-form" @submit.prevent="submit">
        <p class="invite-form__lead">{{ t("auth.invite.subtitle") }}</p>

        <p v-if="!token" class="invite-form__error">{{ t("auth.invite.missingToken") }}</p>

        <AppFormField :label="t('auth.password')">
          <input
            v-model="form.password"
            autocomplete="new-password"
            minlength="8"
            required
            type="password"
          />
        </AppFormField>

        <AppFormField :label="t('auth.invite.passwordConfirm')">
          <input
            v-model="form.passwordConfirm"
            autocomplete="new-password"
            minlength="8"
            required
            type="password"
          />
        </AppFormField>

        <p v-if="formError" class="invite-form__error">{{ formError }}</p>
        <p v-if="success" class="invite-form__success">{{ t("auth.invite.success") }}</p>

        <AppButton :disabled="pending || !canSubmit" block type="submit">
          {{ pending ? t("auth.loading") : t("auth.invite.submit") }}
        </AppButton>
      </form>
    </AppShellSection>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "#app";
import { reactive, ref, computed } from "vue";

import { useAuthSession } from "~/features/auth";
import { ApiRequestError } from "~/shared/api/types";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppButton from "~/shared/ui/app-button/AppButton.vue";
import AppFormField from "~/shared/ui/app-form-field/AppFormField.vue";
import AppShellSection from "~/shared/ui/app-shell-section/AppShellSection.vue";

const route = useRoute();
const router = useRouter();
const { acceptInvite, pending } = useAuthSession();
const { t } = usePreferences();

const rawToken = route.query.token;
const token = computed(() => (Array.isArray(rawToken) ? rawToken[0] : rawToken)?.trim() || "");
const form = reactive({
  password: "",
  passwordConfirm: ""
});
const formError = ref("");
const success = ref(false);
const canSubmit = computed(
  () =>
    token.value.length > 0 && form.password.length >= 8 && form.password === form.passwordConfirm
);

useSeoMeta({
  title: () => t("auth.invite.title"),
  description: () => t("auth.invite.subtitle")
});

async function submit() {
  formError.value = "";
  success.value = false;

  if (!token.value) {
    formError.value = t("auth.invite.missingToken");
    return;
  }

  if (form.password !== form.passwordConfirm) {
    formError.value = t("auth.invite.passwordMismatch");
    return;
  }

  try {
    await acceptInvite({
      password: form.password,
      session_fingerprint: `web-invite-${Date.now()}`,
      token: token.value
    });
    success.value = true;
    await router.push("/");
  } catch (error) {
    formError.value = error instanceof ApiRequestError ? error.message : t("auth.invite.failed");
  }
}
</script>

<style scoped>
.invite-page {
  max-width: 680px;
  height: 100%;
  min-height: 0;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  align-items: center;
}

.invite-page__panel {
  min-height: 0;
}

.invite-form {
  display: grid;
  gap: 0.9rem;
}

.invite-form__lead {
  margin: 0;
  color: var(--c-muted);
}

.invite-form__error,
.invite-form__success {
  margin: 0;
  border-radius: 0.8rem;
  padding: 0.75rem;
}

.invite-form__error {
  background: #450a0a;
  color: #fecaca;
}

.invite-form__success {
  background: #052e1a;
  color: #bbf7d0;
}

@media (max-width: 767px) {
  .invite-page {
    height: auto;
    min-height: 100%;
    align-items: start;
    padding: 0.75rem 0.75rem calc(5.5rem + env(safe-area-inset-bottom));
  }
}
</style>
