export interface CreateMyStudentPayload {
  display_name: string;
  email: string;
  phone?: string | null;
}

export interface CreateStudentInvitePayload {
  delivery_channel?: "link";
  idempotency_key?: string;
  ttl_seconds?: number;
}

export interface StudentInviteSnapshot {
  created_at: string;
  email: string;
  expires_at: string;
  invite_id: string;
  invite_token?: string;
  parent_user_id: string;
  revoked_at: string | null;
  status: "pending" | "used" | "revoked" | "expired";
  student_user_id: string;
  updated_at: string;
  used_at: string | null;
  version: number;
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
