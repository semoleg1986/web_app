import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

import { useApiQuery } from "~/shared/api/use-api-query";
import type { ParentStudentListResponse } from "~/features/parent-students/model/types";

export function useParentStudentsQuery(enabled: MaybeRefOrGetter<boolean> = true) {
  const resolvedEnabled = computed(() => Boolean(toValue(enabled)));

  return useApiQuery<ParentStudentListResponse>("/parent/me/students", {
    immediate: resolvedEnabled,
    server: resolvedEnabled,
    watch: [resolvedEnabled]
  });
}
