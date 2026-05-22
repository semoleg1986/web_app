<template>
  <div class="checkout-card__form">
    <AppButton
      v-if="!showCreateStudentForm"
      variant="ghost"
      size="sm"
      @click="$emit('openCreateChild')"
    >
      {{ t("course.checkout.addChild") }}
    </AppButton>

    <AppFormField :label="t('course.checkout.student')">
      <select :value="selectedStudentId" @change="updateStudent">
        <option v-for="student in students" :key="student.user_id" :value="student.user_id">
          {{ student.display_name }}
        </option>
      </select>
    </AppFormField>

    <AppButton
      :disabled="
        pending ||
        !selectedStudentId ||
        checkoutState?.available_actions.can_create_payment_intent === false
      "
      block
      @click="$emit('submit')"
    >
      {{ pending ? t("course.checkout.pending") : t("course.checkout.submit") }}
    </AppButton>

    <p v-if="errorMessage" class="checkout-card__error">{{ errorMessage }}</p>

    <div v-if="selectedOffer" class="checkout-card__success">
      <strong>{{ t("course.checkout.selectedOffer") }}</strong>
      <p>{{ selectedOffer.offer_id }}</p>
      <p>
        {{ t("course.checkout.total") }}:
        {{ formatMoney(selectedOffer.final_price, selectedOffer.currency) }}
      </p>
    </div>

    <div
      v-if="
        paymentIntent &&
        checkoutState?.checkout_state !== 'access_granted' &&
        checkoutState?.checkout_state !== 'conflict_existing_access'
      "
      class="checkout-card__success"
    >
      <strong>{{ t("course.checkout.success") }}</strong>
      <p>{{ t("course.checkout.intent") }}: {{ paymentIntent.payment_intent_id }}</p>
      <p>
        {{ t("course.checkout.total") }}:
        {{ formatMoney(paymentIntent.final_price, paymentIntent.currency) }}
      </p>
      <p>Status: {{ checkoutState?.checkout_state ?? paymentIntent.status }}</p>
      <p>Next: {{ nextAction }}</p>
    </div>

    <div v-if="accessGrant" class="checkout-card__success">
      <strong>{{ t("course.checkout.accessGranted") }}</strong>
      <p>{{ accessGrant.access_grant_id }}</p>
      <p>{{ accessGrant.status }}</p>
      <template v-if="purchasedOffer">
        <p>{{ purchasedOffer.offer_id }}</p>
        <p>
          {{ t("course.checkout.total") }}:
          {{ formatMoney(purchasedOffer.final_price, purchasedOffer.currency) }}
        </p>
      </template>
    </div>

    <div
      v-if="checkoutState?.checkout_state === 'conflict_existing_access'"
      class="checkout-card__success"
    >
      <strong>{{ t("course.checkout.conflictExistingAccess") }}</strong>
      <p>{{ t("course.checkout.intentConflictHint") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParentStudentItem } from "~/features/parent-students";
import type {
  CheckoutOfferSnapshot,
  CheckoutStateSnapshot,
  CourseAccessGrantSnapshot,
  PaymentIntentSnapshot
} from "~/features/payments";
import { formatMoney } from "~/shared/lib/formatting/format-money";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppButton from "~/shared/ui/app-button/AppButton.vue";
import AppFormField from "~/shared/ui/app-form-field/AppFormField.vue";

defineProps<{
  accessGrant: CourseAccessGrantSnapshot | null;
  checkoutState: CheckoutStateSnapshot | null;
  errorMessage: string;
  nextAction: string;
  paymentIntent: PaymentIntentSnapshot | null;
  pending: boolean;
  purchasedOffer: CheckoutOfferSnapshot | null;
  selectedStudentId: string;
  selectedOffer: CheckoutOfferSnapshot | null;
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
</script>
