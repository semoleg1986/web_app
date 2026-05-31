import { computed, onBeforeUnmount, watch } from "vue";
import type { Ref } from "vue";

import { useAuthSession } from "~/features/auth";
import { useStudentCourseLearningQuery } from "~/features/course-learning/api/use-student-course-learning-query";

const STUDENT_LEARNING_POLL_INTERVAL_MS = 5000;

export function useStudentCourseLearning(courseId: Ref<string>) {
  const { initialized, isAuthenticated, user } = useAuthSession();
  const isStudent = computed(() => Boolean(user.value?.roles.includes("student")));
  const enabled = computed(
    () =>
      initialized.value &&
      isAuthenticated.value &&
      isStudent.value &&
      courseId.value.trim().length > 0
  );

  const {
    apiError,
    data,
    pending,
    refresh
  } = useStudentCourseLearningQuery(courseId, enabled);

  const learning = computed(() => data.value ?? null);
  const denied = computed(() => apiError.value?.statusCode === 403);
  const hasAccess = computed(() => learning.value !== null);
  const shouldPoll = computed(() => enabled.value && !hasAccess.value && !pending.value);
  const progressPercent = computed(() => {
    const rawPercent = learning.value?.progress.progress_percent ?? 0;
    return Math.min(100, Math.max(0, Math.round(rawPercent)));
  });
  const modules = computed(() => learning.value?.modules ?? []);

  let pollTimer: ReturnType<typeof setInterval> | null = null;

  function stopPolling() {
    if (pollTimer !== null) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  function startPolling() {
    if (pollTimer !== null) {
      return;
    }

    pollTimer = setInterval(() => {
      void refresh();
    }, STUDENT_LEARNING_POLL_INTERVAL_MS);
  }

  if (import.meta.client) {
    watch(
      shouldPoll,
      (nextShouldPoll) => {
        if (nextShouldPoll) {
          startPolling();
          return;
        }

        stopPolling();
      },
      { immediate: true }
    );

    onBeforeUnmount(stopPolling);
  }

  return {
    denied,
    hasAccess,
    learning,
    modules,
    pending,
    progressPercent,
    refresh
  };
}
