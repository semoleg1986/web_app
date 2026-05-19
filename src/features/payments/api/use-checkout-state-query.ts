import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

import { useApiQuery } from "~/shared/api/use-api-query";
import type { CheckoutStateSnapshot } from "~/features/payments/model/types";

export function useCheckoutStateQuery(
  studentId: MaybeRefOrGetter<string | null | undefined>,
  courseId: MaybeRefOrGetter<string | null | undefined>
) {
  const resolvedStudentId = computed(() => toValue(studentId)?.trim() || "");
  const resolvedCourseId = computed(() => toValue(courseId)?.trim() || "");
  const enabled = computed(
    () => resolvedStudentId.value.length > 0 && resolvedCourseId.value.length > 0
  );

  return useApiQuery<CheckoutStateSnapshot>(
    computed(
      () =>
        `/parent/payments/students/${resolvedStudentId.value}/courses/${resolvedCourseId.value}/checkout-state`
    ),
    {
      immediate: enabled,
      key: computed(() =>
        enabled.value
          ? `GET:/parent/payments/students/${resolvedStudentId.value}/courses/${resolvedCourseId.value}/checkout-state`
          : "GET:/parent/payments/students/__empty__/courses/__empty__/checkout-state"
      ),
      server: false,
      watch: [resolvedStudentId, resolvedCourseId, enabled]
    }
  );
}
