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
