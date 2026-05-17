import { useApiQuery } from "~/shared/api/use-api-query";
import type { ParentStudentListResponse } from "~/features/parent-students/api/parent-students-client";

export function useParentStudentsQuery(enabled = true) {
  return useApiQuery<ParentStudentListResponse>("/parent/me/students", {
    immediate: enabled,
    server: enabled
  });
}
