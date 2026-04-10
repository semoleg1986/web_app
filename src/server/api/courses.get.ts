import { COURSES } from '~/server/data/courses';

export default defineEventHandler(() => {
  return {
    items: COURSES.map(({ id, title, level, lessonsCount }) => ({
      id,
      title,
      level,
      lessonsCount
    }))
  };
});
