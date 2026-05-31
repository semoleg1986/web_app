import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

import { useApiQuery } from "~/shared/api/use-api-query";
import type { StudentCourseProgressSnapshot } from "~/features/course-learning/model/types";

export function useStudentCourseProgressQuery(
  courseId: MaybeRefOrGetter<string | null | undefined>,
  enabledOverride: MaybeRefOrGetter<boolean> = true
) {
  const resolvedCourseId = computed(() => toValue(courseId)?.trim() || "");
  const overrideEnabled = computed(() => Boolean(toValue(enabledOverride)));
  const enabled = computed(() => overrideEnabled.value && resolvedCourseId.value.length > 0);

  return useApiQuery<StudentCourseProgressSnapshot>(
    computed(() =>
      enabled.value ? `/student/courses/${resolvedCourseId.value}/progress` : null
    ),
    {
      dedupe: "defer",
      immediate: enabled,
      key: computed(() =>
        enabled.value
          ? `GET:/student/courses/${resolvedCourseId.value}/progress`
          : "GET:/student/courses/__empty__/progress"
      ),
      server: false,
      watch: [resolvedCourseId, overrideEnabled]
    }
  );
}
