export interface StudentCourseProgressSnapshot {
  completed_at: string | null;
  completed_lessons: number;
  course_id: string;
  progress_percent: number;
  status: string;
  title: string;
  total_lessons: number;
}
