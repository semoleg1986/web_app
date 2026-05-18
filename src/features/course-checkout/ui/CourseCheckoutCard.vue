<template>
  <AppCard class="checkout-card">
    <h2>{{ t("course.checkout.title") }}</h2>

    <p v-if="!isAuthenticated">{{ t("course.checkout.loginRequired") }}</p>
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
        :error-message="checkoutError"
        :payment-intent="paymentIntent"
        :pending="checkoutPending"
        :selected-student-id="selectedStudentId"
        :show-create-student-form="showCreateStudentForm"
        :students="students"
        @open-create-child="showCreateStudentForm = true"
        @submit="createIntent"
        @update-student="selectedStudentId = $event"
      />
    </div>
  </AppCard>
</template>

<script setup lang="ts">
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
</style>
