export interface CourseCardItem {
  id: string;
  title: string;
  level: string;
  lessonsCount: number;
}

export interface CourseDetailsItem extends CourseCardItem {
  description: string;
}
