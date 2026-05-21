import { defineNuxtRouteMiddleware, navigateTo } from "#imports";
import { isValidCourseRouteId } from "~/features/course-catalog/model/resolve-course-route-id";

export default defineNuxtRouteMiddleware((to) => {
  if (to.name !== "courses-id") {
    return;
  }

  const routeParam = to.params.id;
  const courseId = Array.isArray(routeParam) ? routeParam[0] : routeParam;

  if (!isValidCourseRouteId(courseId)) {
    return navigateTo("/", { redirectCode: 302 });
  }
});
