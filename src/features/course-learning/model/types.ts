export interface StudentCourseLearningProgressSnapshot {
  completed_at: string | null;
  completed_lessons: number;
  progress_percent: number;
  status: string;
  total_lessons: number;
}

export interface StudentCourseLearningLessonSnapshot {
  content_ref: string | null;
  content_type: string;
  description: string | null;
  duration_minutes: number | null;
  is_completed: boolean;
  is_preview: boolean;
  lesson_id: string;
  progress_status: string;
  title: string;
}

export interface StudentCourseLearningModuleSnapshot {
  description: string | null;
  is_required: boolean;
  lessons: StudentCourseLearningLessonSnapshot[];
  lessons_count: number;
  module_id: string;
  title: string;
}

export interface StudentCourseLearningSnapshot {
  course_id: string;
  description: string | null;
  level: string;
  modules: StudentCourseLearningModuleSnapshot[];
  next_lesson_id: string | null;
  progress: StudentCourseLearningProgressSnapshot;
  title: string;
}
