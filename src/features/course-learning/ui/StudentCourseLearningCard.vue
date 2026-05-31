<template>
  <div v-if="hasAccess" class="student-learning student-learning--success">
    <strong>{{ t("course.checkout.studentAccessGrantedTitle") }}</strong>
    <p>{{ t("course.checkout.studentAccessGrantedBody") }}</p>

    <div v-if="learning" class="student-learning__progress">
      <div class="student-learning__progress-row">
        <span>{{ t("course.learning.progress") }}</span>
        <strong>{{ progressPercent }}%</strong>
      </div>
      <div class="student-learning__progress-track" aria-hidden="true">
        <span :style="{ width: `${progressPercent}%` }" />
      </div>
      <p>
        {{
          t("course.learning.completedLessons")
            .replace("{completed}", String(learning.progress.completed_lessons))
            .replace("{total}", String(learning.progress.total_lessons))
        }}
      </p>
    </div>

    <div v-if="modules.length > 0" class="student-learning__modules">
      <strong>{{ t("course.learning.modules") }}</strong>
      <ul>
        <li v-for="module in modules" :key="module.module_id">
          <div>
            <span>{{ module.title }}</span>
            <small v-if="module.lessons.length > 0" class="student-learning__lesson-list">
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
      class="student-learning__action"
      type="button"
      :disabled="pending"
      @click="refresh"
    >
      {{ pending ? t("course.learning.refreshing") : t("course.learning.continue") }}
    </button>
  </div>

  <div v-else-if="pending" class="student-learning">
    <strong>{{ t("course.checkout.studentAccessPendingTitle") }}</strong>
    <p>{{ t("course.checkout.studentAccessPendingBody") }}</p>
  </div>

  <div v-else class="student-learning">
    <strong>{{ t("course.checkout.studentNoticeTitle") }}</strong>
    <p>{{ t("course.checkout.studentNoticeBody") }}</p>
  </div>
</template>

<script setup lang="ts">
import { toRef } from "vue";

import { useStudentCourseLearning } from "~/features/course-learning/model/use-student-course-learning";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

const props = defineProps<{
  courseId: string;
}>();

const { t } = usePreferences();
const courseId = toRef(props, "courseId");
const { hasAccess, learning, modules, pending, progressPercent, refresh } =
  useStudentCourseLearning(courseId);
</script>

<style scoped>
.student-learning {
  display: grid;
  gap: 0.45rem;
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--c-accent) 22%, var(--c-border));
  border-radius: 1rem;
  background: color-mix(in srgb, var(--c-accent) 8%, var(--c-surface));
}

.student-learning--success {
  border-color: color-mix(in srgb, #2f9e44 34%, var(--c-border));
  background: color-mix(in srgb, #2f9e44 12%, var(--c-surface));
}

.student-learning strong,
.student-learning p {
  margin: 0;
}

.student-learning p {
  color: var(--c-muted);
}

.student-learning__progress {
  display: grid;
  gap: 0.45rem;
  margin-top: 0.35rem;
}

.student-learning__progress-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.92rem;
}

.student-learning__progress-track {
  overflow: hidden;
  height: 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--c-border) 72%, transparent);
}

.student-learning__progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: color-mix(in srgb, #2f9e44 70%, var(--c-accent));
  transition: width 180ms ease;
}

.student-learning__modules {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.45rem;
}

.student-learning__modules ul {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.student-learning__modules li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid color-mix(in srgb, var(--c-border) 84%, transparent);
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--c-surface) 72%, transparent);
}

.student-learning__modules li > div {
  min-width: 0;
  display: grid;
  gap: 0.2rem;
}

.student-learning__modules small {
  color: var(--c-muted);
  white-space: nowrap;
}

.student-learning__lesson-list {
  display: block;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
}

.student-learning__action {
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

.student-learning__action:disabled {
  cursor: wait;
  opacity: 0.72;
}
</style>
