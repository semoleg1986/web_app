import { useApiClient } from "~/shared/api/use-api-client";

export interface CreateMyStudentPayload {
  display_name: string;
  email: string;
  phone?: string | null;
}

export interface ParentStudentItem {
  created_at: string;
  display_name: string;
  email: string;
  phone: string | null;
  roles: string[];
  status: string;
  updated_at: string;
  user_id: string;
  version: number;
}

export interface ParentStudentListResponse {
  items: ParentStudentItem[];
  limit: number;
  offset: number;
  sort: string;
}

export function useParentStudentsClient() {
  const api = useApiClient();

  return {
    createMyStudent(payload: CreateMyStudentPayload) {
      return api.post<ParentStudentItem, CreateMyStudentPayload>(
        "/parent/me/students",
        payload
      );
    },
    listMyStudents() {
      return api.get<ParentStudentListResponse>("/parent/me/students");
    }
  };
}
