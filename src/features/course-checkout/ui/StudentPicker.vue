<template>
  <div class="checkout-card__form">
    <AppButton v-if="!showCreateStudentForm" variant="ghost" size="sm" @click="$emit('openCreateChild')">
      {{ t("course.checkout.addChild") }}
    </AppButton>

    <AppFormField :label="t('course.checkout.student')">
      <select :value="selectedStudentId" @change="updateStudent">
        <option v-for="student in students" :key="student.user_id" :value="student.user_id">
          {{ student.display_name }}
        </option>
      </select>
    </AppFormField>

    <AppButton :disabled="pending || !selectedStudentId" block @click="$emit('submit')">
      {{ pending ? t("course.checkout.pending") : t("course.checkout.submit") }}
    </AppButton>

    <p v-if="errorMessage" class="checkout-card__error">{{ errorMessage }}</p>

    <div v-if="paymentIntent" class="checkout-card__success">
      <strong>{{ t("course.checkout.success") }}</strong>
      <p>{{ t("course.checkout.intent") }}: {{ paymentIntent.payment_intent_id }}</p>
      <p>{{ t("course.checkout.total") }}: {{ formatMoney(paymentIntent.final_price, paymentIntent.currency) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParentStudentItem } from "~/features/parent-students";
import type { PaymentIntentSnapshot } from "~/features/payments";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppButton from "~/shared/ui/app-button/AppButton.vue";
import AppFormField from "~/shared/ui/app-form-field/AppFormField.vue";

defineProps<{
  errorMessage: string;
  paymentIntent: PaymentIntentSnapshot | null;
  pending: boolean;
  selectedStudentId: string;
  showCreateStudentForm: boolean;
  students: ParentStudentItem[];
}>();

const emit = defineEmits<{
  openCreateChild: [];
  submit: [];
  updateStudent: [studentId: string];
}>();

const { t } = usePreferences();

function updateStudent(event: Event) {
  emit("updateStudent", (event.target as HTMLSelectElement).value);
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    currency,
    maximumFractionDigits: 0,
    style: "currency"
  }).format(amount);
}
</script>
