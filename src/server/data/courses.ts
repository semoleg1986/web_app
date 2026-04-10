export interface CourseDataItem {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessonsCount: number;
  description: string;
}

export const COURSES: CourseDataItem[] = [
  {
    id: 'course-math-5',
    title: 'Математика 5 класс',
    level: 'beginner',
    lessonsCount: 24,
    description: 'Базовая математика для 5 класса: числа, дроби, уравнения и логика.'
  },
  {
    id: 'course-physics-7',
    title: 'Физика 7 класс',
    level: 'intermediate',
    lessonsCount: 18,
    description: 'Введение в физику: механика, эксперименты и практические задачи.'
  },
  {
    id: 'course-olymp',
    title: 'Олимпиадная математика',
    level: 'advanced',
    lessonsCount: 30,
    description: 'Продвинутая программа для олимпиад: стратегии решения и интенсивная практика.'
  }
];

export function findCourseById(id: string): CourseDataItem | undefined {
  return COURSES.find((course) => course.id === id);
}
