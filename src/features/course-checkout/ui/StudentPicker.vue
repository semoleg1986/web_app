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

    <div class="checkout-card__invite">
      <AppButton
        :disabled="createInvitePending || !selectedStudentId"
        variant="ghost"
        size="sm"
        @click="$emit('createInvite')"
      >
        {{
          createInvitePending
            ? t("course.checkout.invitePending")
            : t("course.checkout.inviteChild")
        }}
      </AppButton>
      <p v-if="createInviteError" class="checkout-card__error">{{ createInviteError }}</p>
      <div v-if="inviteUrl" class="checkout-card__invite-link">
        <strong>{{ t("course.checkout.inviteReady") }}</strong>
        <div class="checkout-card__invite-copy">
          <input :value="inviteUrl" readonly @focus="selectInput" />
          <AppButton size="sm" variant="ghost" @click="copyInviteUrl">
            {{ inviteCopied ? t("course.checkout.inviteCopied") : t("course.checkout.inviteCopy") }}
          </AppButton>
        </div>
        <p>{{ t("course.checkout.inviteHint") }}</p>
      </div>
    </div>

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
      v-if="paymentIntent && checkoutState?.checkout_state === 'payment_rejected'"
      class="checkout-card__rejected"
    >
      <strong>{{ t("course.checkout.rejected") }}</strong>
      <p>{{ t("course.checkout.intent") }}: {{ paymentIntent.payment_intent_id }}</p>
      <p>
        {{ t("course.checkout.total") }}:
        {{ formatMoney(paymentIntent.final_price, paymentIntent.currency) }}
      </p>
      <p>Status: {{ checkoutState?.checkout_state }}</p>
      <p>{{ t("course.checkout.retryHint") }}</p>
    </div>

    <div
      v-if="
        paymentIntent &&
        checkoutState?.checkout_state !== 'access_granted' &&
        checkoutState?.checkout_state !== 'conflict_existing_access' &&
        checkoutState?.checkout_state !== 'payment_rejected'
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
import { ref } from "vue";

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

const props = defineProps<{
  accessGrant: CourseAccessGrantSnapshot | null;
  checkoutState: CheckoutStateSnapshot | null;
  createInviteError: string;
  createInvitePending: boolean;
  errorMessage: string;
  inviteUrl: string;
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
  createInvite: [];
  openCreateChild: [];
  submit: [];
  updateStudent: [studentId: string];
}>();

const { t } = usePreferences();
const inviteCopied = ref(false);

function updateStudent(event: Event) {
  emit("updateStudent", (event.target as HTMLSelectElement).value);
}

function selectInput(event: Event) {
  (event.target as HTMLInputElement).select();
}

async function copyInviteUrl() {
  inviteCopied.value = false;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(props.inviteUrl);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = props.inviteUrl;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  inviteCopied.value = true;
  window.setTimeout(() => {
    inviteCopied.value = false;
  }, 1800);
}
</script>

<style scoped>
.checkout-card__invite {
  display: grid;
  gap: 0.55rem;
}

.checkout-card__invite-link {
  display: grid;
  gap: 0.45rem;
  border: 1px solid var(--c-border);
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--c-surface) 88%, var(--c-accent));
  padding: 0.75rem;
}

.checkout-card__invite-link input {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--c-border);
  border-radius: 0.65rem;
  background: var(--c-bg);
  color: var(--c-fg);
  padding: 0.65rem;
  font: inherit;
  font-size: 0.82rem;
}

.checkout-card__invite-copy {
  display: grid;
  gap: 0.45rem;
  grid-template-columns: minmax(0, 1fr) auto;
}

.checkout-card__invite-link p {
  margin: 0;
  color: var(--c-muted);
  font-size: 0.82rem;
}

@media (max-width: 520px) {
  .checkout-card__invite-copy {
    grid-template-columns: minmax(0, 1fr);
  }
}

.checkout-card__error {
  margin: 0;
  color: #ef4444;
}

.checkout-card__rejected {
  border: 1px solid #7f1d1d;
  border-radius: 0.5rem;
  background: #450a0a;
  color: #fecaca;
  padding: 0.75rem;
}
</style>
