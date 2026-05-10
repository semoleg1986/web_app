import { normalizeCourseLevel, useCourseDetails } from "~/features/course-catalog";
import { buildCourseTitle } from "~/shared/lib/seo/build-course-title";

export async function useCourseDetailsPage() {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();

  const routeParam = route.params.id;
  const courseId = Array.isArray(routeParam) ? routeParam[0] : routeParam;

  if (!courseId) {
    throw createError({ statusCode: 404, statusMessage: "Course not found" });
  }

  const { course } = await useCourseDetails(courseId);
  const siteUrl = computed(() => String(runtimeConfig.public.siteUrl || "http://localhost:3000"));
  const courseUrl = computed(() => `${siteUrl.value}/courses/${course.value.id}`);
  const courseTitle = computed(() => buildCourseTitle(course.value.title));

  const courseSchema = computed(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: runtimeConfig.public.appName,
            item: siteUrl.value
          },
          {
            "@type": "ListItem",
            position: 2,
            name: course.value.title,
            item: courseUrl.value
          }
        ]
      },
      {
        "@type": "Course",
        name: course.value.title,
        url: courseUrl.value,
        description: course.value.description,
        educationalLevel: normalizeCourseLevel(course.value.level),
        provider: {
          "@type": "Organization",
          name: runtimeConfig.public.appName,
          url: siteUrl.value
        }
      }
    ]
  }));

  return {
    course,
    courseSchema,
    courseTitle,
    courseUrl
  };
}
