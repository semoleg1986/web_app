import { createError } from "h3";
import { findCourseById } from "~/server/data/courses";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Course id is required" });
  }

  const course = findCourseById(id);
  if (!course) {
    throw createError({ statusCode: 404, statusMessage: "Course not found" });
  }

  return { item: course };
});
