import { useApiClient } from "~/shared/api/use-api-client";
import type {
  CreateMyStudentPayload,
  ParentStudentItem
} from "~/features/parent-students/model/types";

export function useParentStudentsCommands() {
  const api = useApiClient();

  return {
    createMyStudent(payload: CreateMyStudentPayload) {
      return api.post<ParentStudentItem, CreateMyStudentPayload>("/parent/me/students", payload);
    }
  };
}
