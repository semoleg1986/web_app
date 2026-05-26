export interface CourseAccessDecisionSnapshot {
  actor_account_id: string;
  checked_at: string;
  course_id: string;
  decision: "allow" | "deny";
  enrollment_status: string | null;
  grant_status: string | null;
  reason_code: string;
  student_id: string | null;
}
