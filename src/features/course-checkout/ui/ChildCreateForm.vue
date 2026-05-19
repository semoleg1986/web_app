<template>
  <div class="checkout-card__form">
    <h3>{{ t("course.checkout.addChildTitle") }}</h3>
    <p v-if="showEmptyState">{{ t("course.checkout.noStudents") }}</p>

    <AppFormField :label="t('course.checkout.childName')">
      <input
        :value="form.display_name"
        type="text"
        autocomplete="name"
        @input="updateField('display_name', $event)"
      />
    </AppFormField>

    <AppFormField :label="t('course.checkout.childEmail')">
      <input
        :value="form.email"
        type="email"
        autocomplete="email"
        @input="updateField('email', $event)"
      />
    </AppFormField>

    <AppFormField :label="t('course.checkout.childPhone')">
      <input
        :value="form.phone"
        type="tel"
        autocomplete="tel"
        @input="updateField('phone', $event)"
      />
    </AppFormField>

    <AppButton :disabled="pending || !canSubmit" block @click="$emit('submit')">
      {{ pending ? t("course.checkout.childPending") : t("course.checkout.childCreate") }}
    </AppButton>

    <p v-if="errorMessage" class="checkout-card__error">{{ errorMessage }}</p>
    <p v-if="success" class="checkout-card__success-text">
      {{ t("course.checkout.childSuccess") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppButton from "~/shared/ui/app-button/AppButton.vue";
import AppFormField from "~/shared/ui/app-form-field/AppFormField.vue";

defineProps<{
  canSubmit: boolean;
  errorMessage: string;
  form: {
    display_name: string;
    email: string;
    phone: string;
  };
  pending: boolean;
  showEmptyState: boolean;
  success: boolean;
}>();

const emit = defineEmits<{
  submit: [];
  updateField: [field: "display_name" | "email" | "phone", value: string];
}>();

const { t } = usePreferences();

function updateField(field: "display_name" | "email" | "phone", event: Event) {
  emit("updateField", field, (event.target as HTMLInputElement).value);
}
</script>
