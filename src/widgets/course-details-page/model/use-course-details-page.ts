import { normalizeCourseLevel, useCourseDetails } from "~/features/course-catalog";
import { buildCourseTitle } from "~/shared/lib/seo/build-course-title";

export function useCourseDetailsPage() {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();

  const routeParam = route.params.id;
  const slug = Array.isArray(routeParam) ? routeParam[0] : routeParam;

  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: "Course not found" });
  }

  const { course, pending } = useCourseDetails(slug);
  const siteUrl = computed(() => String(runtimeConfig.public.siteUrl || "http://localhost:3000"));
  const courseUrl = computed(() => `${siteUrl.value}/courses/${course.value?.id ?? slug}`);
  const courseTitle = computed(() => buildCourseTitle(course.value?.title ?? "Course"));

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
            name: course.value?.title ?? "Course",
            item: courseUrl.value
          }
        ]
      },
      {
        "@type": "Course",
        name: course.value?.title ?? "Course",
        url: courseUrl.value,
        description: course.value?.description ?? "",
        educationalLevel: normalizeCourseLevel(course.value?.level ?? "unknown"),
        offers: course.value?.defaultOffer
          ? {
              "@type": "Offer",
              price: course.value.defaultOffer.price.salePrice,
              priceCurrency: course.value.defaultOffer.price.currency
            }
          : undefined,
        provider: {
          "@type": "Organization",
          name: runtimeConfig.public.appName,
          url: siteUrl.value
        }
      }
    ]
  }));

  function formatPrice(price: (typeof course.value.offers)[number]["price"]) {
    return new Intl.NumberFormat(undefined, {
      currency: price.currency,
      maximumFractionDigits: 0,
      style: "currency"
    }).format(price.salePrice);
  }

  return {
    course,
    courseSchema,
    courseTitle,
    courseUrl,
    formatPrice,
    pending
  };
}
