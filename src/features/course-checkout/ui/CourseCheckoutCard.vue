<template>
  <AppCard class="checkout-card">
    <h2>{{ t("course.checkout.title") }}</h2>

    <p v-if="!isAuthenticated">{{ t("course.checkout.loginRequired") }}</p>
    <p v-else-if="!isParent">{{ t("course.checkout.parentOnly") }}</p>
    <p v-else-if="!course.defaultOffer">{{ t("course.checkout.noOffer") }}</p>
    <div v-else class="checkout-card__stack">
      <div v-if="students.length === 0 || showCreateStudentForm" class="checkout-card__form">
        <h3>{{ t("course.checkout.addChildTitle") }}</h3>
        <p v-if="students.length === 0">{{ t("course.checkout.noStudents") }}</p>

        <AppFormField :label="t('course.checkout.childName')">
          <input v-model="createStudentForm.display_name" type="text" autocomplete="name" />
        </AppFormField>

        <AppFormField :label="t('course.checkout.childEmail')">
          <input v-model="createStudentForm.email" type="email" autocomplete="email" />
        </AppFormField>

        <AppFormField :label="t('course.checkout.childPhone')">
          <input v-model="createStudentForm.phone" type="tel" autocomplete="tel" />
        </AppFormField>

        <AppButton :disabled="createStudentPending || !canCreateStudent" block @click="createStudent">
          {{
            createStudentPending
              ? t("course.checkout.childPending")
              : t("course.checkout.childCreate")
          }}
        </AppButton>

        <p v-if="createStudentError" class="checkout-card__error">{{ createStudentError }}</p>
        <p v-if="createStudentSuccess" class="checkout-card__success-text">
          {{ t("course.checkout.childSuccess") }}
        </p>
      </div>

      <div v-if="students.length > 0" class="checkout-card__form">
        <AppButton
          v-if="!showCreateStudentForm"
          variant="ghost"
          size="sm"
          @click="showCreateStudentForm = true"
        >
          {{ t("course.checkout.addChild") }}
        </AppButton>

        <AppFormField :label="t('course.checkout.student')">
          <select v-model="selectedStudentId">
            <option v-for="student in students" :key="student.user_id" :value="student.user_id">
              {{ student.display_name }}
            </option>
          </select>
        </AppFormField>

        <AppButton :disabled="checkoutPending || !selectedStudentId" block @click="createIntent">
          {{ checkoutPending ? t("course.checkout.pending") : t("course.checkout.submit") }}
        </AppButton>

        <p v-if="checkoutError" class="checkout-card__error">{{ checkoutError }}</p>

        <div v-if="paymentIntent" class="checkout-card__success">
          <strong>{{ t("course.checkout.success") }}</strong>
          <p>{{ t("course.checkout.intent") }}: {{ paymentIntent.payment_intent_id }}</p>
          <p>
            {{ t("course.checkout.total") }}:
            {{ formatMoney(paymentIntent.final_price, paymentIntent.currency) }}
          </p>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { CourseDetailsItem } from "~/features/course-catalog";
import { useCourseCheckout } from "~/features/course-checkout/model/use-course-checkout";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppButton from "~/shared/ui/app-button/AppButton.vue";
import AppCard from "~/shared/ui/app-card/AppCard.vue";
import AppFormField from "~/shared/ui/app-form-field/AppFormField.vue";

const props = defineProps<{
  course: CourseDetailsItem;
}>();

const { t } = usePreferences();
const course = toRef(props, "course");
const {
  canCreateStudent,
  checkoutError,
  checkoutPending,
  createIntent,
  createStudent,
  createStudentError,
  createStudentForm,
  createStudentPending,
  createStudentSuccess,
  isAuthenticated,
  isParent,
  paymentIntent,
  selectedStudentId,
  showCreateStudentForm,
  students
} = useCourseCheckout(course);

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    currency,
    maximumFractionDigits: 0,
    style: "currency"
  }).format(amount);
}
</script>

<style scoped>
.checkout-card {
  padding: 1rem;
}

.checkout-card__stack {
  display: grid;
  gap: 1rem;
}

.checkout-card__form {
  display: grid;
  gap: 0.75rem;
}

.checkout-card__success-text {
  margin: 0;
  color: var(--c-accent);
}

.checkout-card__error {
  color: #c0392b;
}

.checkout-card__success {
  display: grid;
  gap: 0.25rem;
}

.checkout-card__success p,
.checkout-card h2,
.checkout-card h3,
.checkout-card p,
.checkout-card strong {
  margin: 0;
}
</style>
