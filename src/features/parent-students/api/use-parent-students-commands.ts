import { useApiClient } from "~/shared/api/use-api-client";
import type {
  CreateMyStudentPayload,
  CreateStudentInvitePayload,
  ParentStudentItem,
  StudentInviteSnapshot
} from "~/features/parent-students/model/types";

export function useParentStudentsCommands() {
  const api = useApiClient();

  return {
    createMyStudent(payload: CreateMyStudentPayload) {
      return api.post<ParentStudentItem, CreateMyStudentPayload>("/parent/me/students", payload);
    },
    createStudentInvite(studentId: string, payload: CreateStudentInvitePayload = {}) {
      return api.post<StudentInviteSnapshot, CreateStudentInvitePayload>(
        `/parent/me/students/${studentId}/invite`,
        payload
      );
    }
  };
}
