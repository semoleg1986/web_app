<template>
  <AppCard class="checkout-card">
    <h2>{{ isStudent ? t("course.checkout.studentTitle") : t("course.checkout.title") }}</h2>

    <p v-if="!isAuthenticated">{{ t("course.checkout.loginRequired") }}</p>
    <div
      v-else-if="isStudent && studentHasCourseAccess"
      class="checkout-card__notice checkout-card__notice--success"
    >
      <strong>{{ t("course.checkout.studentAccessGrantedTitle") }}</strong>
      <p>{{ t("course.checkout.studentAccessGrantedBody") }}</p>
      <div v-if="studentCourseLearning" class="checkout-card__progress">
        <div class="checkout-card__progress-row">
          <span>{{ t("course.learning.progress") }}</span>
          <strong>{{ progressPercent }}%</strong>
        </div>
        <div class="checkout-card__progress-track" aria-hidden="true">
          <span :style="{ width: `${progressPercent}%` }" />
        </div>
        <p>
          {{
            t("course.learning.completedLessons")
              .replace("{completed}", String(studentCourseLearning.progress.completed_lessons))
              .replace("{total}", String(studentCourseLearning.progress.total_lessons))
          }}
        </p>
      </div>
      <div v-if="courseModules.length > 0" class="checkout-card__modules">
        <strong>{{ t("course.learning.modules") }}</strong>
        <ul>
          <li v-for="module in courseModules" :key="module.module_id">
            <div>
              <span>{{ module.title }}</span>
              <small v-if="module.lessons.length > 0" class="checkout-card__lesson-list">
                {{ module.lessons.map((lesson) => lesson.title).join(", ") }}
              </small>
            </div>
            <small>
              {{
                t("course.learning.moduleLessons").replace(
                  "{count}",
                  String(module.lessons_count)
                )
              }}
            </small>
          </li>
        </ul>
      </div>
      <button
        class="checkout-card__action"
        type="button"
        :disabled="studentCourseLearningPending"
        @click="refreshStudentCourseLearning"
      >
        {{
          studentCourseLearningPending
            ? t("course.learning.refreshing")
            : t("course.learning.continue")
        }}
      </button>
    </div>
    <div v-else-if="isStudentCourseAccessPending" class="checkout-card__notice">
      <strong>{{ t("course.checkout.studentAccessPendingTitle") }}</strong>
      <p>{{ t("course.checkout.studentAccessPendingBody") }}</p>
    </div>
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
import { computed, toRef } from "vue";

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
  refreshStudentCourseLearning,
  selectedStudentId,
  selectedOffer,
  showCreateStudentForm,
  studentCourseLearningPending: isStudentCourseAccessPending,
  studentHasCourseAccess,
  students,
  studentCourseLearning,
  studentCourseLearningPending,
  updateCreateStudentField
} = useCourseCheckout(course);

const progressPercent = computed(() => {
  const rawPercent = studentCourseLearning.value?.progress.progress_percent ?? 0;
  return Math.min(100, Math.max(0, Math.round(rawPercent)));
});
const courseModules = computed(() => studentCourseLearning.value?.modules ?? []);
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

.checkout-card__notice--success {
  border-color: color-mix(in srgb, #2f9e44 34%, var(--c-border));
  background: color-mix(in srgb, #2f9e44 12%, var(--c-surface));
}

.checkout-card__notice strong,
.checkout-card__notice p {
  margin: 0;
}

.checkout-card__notice p {
  color: var(--c-muted);
}

.checkout-card__progress {
  display: grid;
  gap: 0.45rem;
  margin-top: 0.35rem;
}

.checkout-card__progress-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.92rem;
}

.checkout-card__progress-track {
  overflow: hidden;
  height: 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--c-border) 72%, transparent);
}

.checkout-card__progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: color-mix(in srgb, #2f9e44 70%, var(--c-accent));
  transition: width 180ms ease;
}

.checkout-card__modules {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.45rem;
}

.checkout-card__modules ul {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.checkout-card__modules li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid color-mix(in srgb, var(--c-border) 84%, transparent);
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--c-surface) 72%, transparent);
}

.checkout-card__modules li > div {
  min-width: 0;
  display: grid;
  gap: 0.2rem;
}

.checkout-card__modules small {
  color: var(--c-muted);
  white-space: nowrap;
}

.checkout-card__lesson-list {
  display: block;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
}

.checkout-card__action {
  width: 100%;
  margin-top: 0.35rem;
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: 999px;
  background: var(--c-accent);
  color: var(--c-accent-contrast);
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.checkout-card__action:disabled {
  cursor: wait;
  opacity: 0.72;
}
</style>
