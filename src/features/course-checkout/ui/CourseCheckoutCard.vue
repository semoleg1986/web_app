<template>
  <AppCard class="checkout-card">
    <h2>{{ isStudent ? t("course.checkout.studentTitle") : t("course.checkout.title") }}</h2>

    <p v-if="!isAuthenticated">{{ t("course.checkout.loginRequired") }}</p>
    <div v-else-if="isStudent" class="checkout-card__notice">
      <strong>{{ t("course.checkout.studentNoticeTitle") }}</strong>
      <p>{{ t("course.checkout.studentNoticeBody") }}</p>
    </div>
    <p v-else-if="!isParent">{{ t("course.checkout.parentOnly") }}</p>
    <p v-else-if="!course.defaultOffer">{{ t("course.checkout.noOffer") }}</p>
    <div v-else class="checkout-card__stack">
      <ChildCreateForm
        v-if="students.length === 0 || showCreateStudentForm"
        :can-submit="canCreateStudent"
        :error-message="createStudentError"
        :form="createStudentForm"
        :pending="createStudentPending"
        :show-empty-state="students.length === 0"
        :success="createStudentSuccess"
        @submit="createStudent"
        @update-field="updateCreateStudentField"
      />

      <StudentPicker
        v-if="students.length > 0"
        :access-grant="accessGrant"
        :checkout-state="checkoutState"
        :create-invite-error="createInviteError"
        :create-invite-pending="createInvitePending"
        :error-message="checkoutError"
        :invite-url="inviteUrl"
        :next-action="nextAction"
        :payment-intent="paymentIntent"
        :pending="checkoutPending"
        :purchased-offer="purchasedOffer"
        :selected-student-id="selectedStudentId"
        :selected-offer="selectedOffer"
        :show-create-student-form="showCreateStudentForm"
        :students="students"
        @open-create-child="showCreateStudentForm = true"
        @create-invite="createInvite"
        @submit="createIntent"
        @update-student="selectedStudentId = $event"
      />
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { toRef } from "vue";

import type { CourseDetailsItem } from "~/features/course-catalog";
import { useCourseCheckout } from "~/features/course-checkout/model/use-course-checkout";
import ChildCreateForm from "~/features/course-checkout/ui/ChildCreateForm.vue";
import StudentPicker from "~/features/course-checkout/ui/StudentPicker.vue";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppCard from "~/shared/ui/app-card/AppCard.vue";

const props = defineProps<{
  course: CourseDetailsItem;
}>();

const { t } = usePreferences();
const course = toRef(props, "course");
const {
  accessGrant,
  canCreateStudent,
  checkoutError,
  checkoutPending,
  checkoutState,
  createInvite,
  createInviteError,
  createInvitePending,
  createIntent,
  createStudent,
  createStudentError,
  createStudentForm,
  createStudentPending,
  createStudentSuccess,
  isAuthenticated,
  isParent,
  isStudent,
  inviteUrl,
  nextAction,
  paymentIntent,
  purchasedOffer,
  selectedStudentId,
  selectedOffer,
  showCreateStudentForm,
  students,
  updateCreateStudentField
} = useCourseCheckout(course);
</script>

<style scoped>
.checkout-card {
  padding: 1rem;
}

.checkout-card__stack {
  display: grid;
  gap: 1rem;
}

.checkout-card__notice {
  display: grid;
  gap: 0.45rem;
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--c-accent) 22%, var(--c-border));
  border-radius: 1rem;
  background: color-mix(in srgb, var(--c-accent) 8%, var(--c-surface));
}

.checkout-card__notice strong,
.checkout-card__notice p {
  margin: 0;
}

.checkout-card__notice p {
  color: var(--c-muted);
}
</style>
