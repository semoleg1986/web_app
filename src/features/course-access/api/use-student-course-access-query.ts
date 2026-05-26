import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

import { useApiQuery } from "~/shared/api/use-api-query";
import type { CourseAccessDecisionSnapshot } from "~/features/course-access/model/types";

export function useStudentCourseAccessQuery(
  courseId: MaybeRefOrGetter<string | null | undefined>,
  enabledOverride: MaybeRefOrGetter<boolean> = true
) {
  const resolvedCourseId = computed(() => toValue(courseId)?.trim() || "");
  const overrideEnabled = computed(() => Boolean(toValue(enabledOverride)));
  const enabled = computed(() => overrideEnabled.value && resolvedCourseId.value.length > 0);

  return useApiQuery<CourseAccessDecisionSnapshot>(
    computed(() =>
      enabled.value ? `/student/courses/${resolvedCourseId.value}/access` : null
    ),
    {
      dedupe: "defer",
      immediate: enabled,
      key: computed(() =>
        enabled.value
          ? `GET:/student/courses/${resolvedCourseId.value}/access`
          : "GET:/student/courses/__empty__/access"
      ),
      server: false,
      watch: [resolvedCourseId, overrideEnabled]
    }
  );
}
