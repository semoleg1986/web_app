import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

import { useApiQuery } from "~/shared/api/use-api-query";
import type { ParentStudentListResponse } from "~/features/parent-students/model/types";

export function useParentStudentsQuery(
  enabled: MaybeRefOrGetter<boolean> = true,
  parentUserId: MaybeRefOrGetter<string | null | undefined> = ""
) {
  const resolvedEnabled = computed(() => Boolean(toValue(enabled)));
  const resolvedParentUserId = computed(() => toValue(parentUserId)?.trim() || "");

  return useApiQuery<ParentStudentListResponse>("/parent/me/students", {
    immediate: resolvedEnabled,
    key: computed(() =>
      resolvedEnabled.value
        ? `GET:/parent/me/students:${resolvedParentUserId.value || "__anonymous__"}`
        : "GET:/parent/me/students:__disabled__"
    ),
    server: resolvedEnabled,
    watch: [resolvedEnabled, resolvedParentUserId]
  });
}
