import {
  buildProxyHeaders,
  proxyJsonRequest,
  resolveServiceBaseUrl
} from "~/server/utils/upstream-proxy";
import { resolveCourseRouteId } from "~/features/course-catalog/model/resolve-course-route-id";

interface UpstreamPublicCourseCard {
  course_id: string;
  description: string | null;
  lessons_total: number;
  level: string;
  slug: string;
  title: string;
}

interface UpstreamCatalogOfferCard {
  course_id: string;
  default_offer: {
    description_short: string;
    feature_flags: {
      delivery_mode: string;
      homework_review_included: boolean;
      teacher_included: boolean;
    };
    offer_code: string;
    offer_id: string;
    price: {
      currency: string;
      discount_reason: string | null;
      list_price: number;
      sale_price: number;
    };
    promo_labels: Array<{
      kind: string;
      label: string;
    }>;
    title: string;
  };
  description_short: string;
  level: string;
  lessons_count: number;
  offers_count: number;
  title: string;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event) ?? new Headers();

  const [courses, catalog] = await Promise.all([
    proxyJsonRequest<UpstreamPublicCourseCard[]>(event, {
      headers,
      method: "GET",
      url: `${resolveServiceBaseUrl(runtimeConfig.courseServiceBaseUrl, "http://localhost:8001")}/v1/public/courses`
    }),
    proxyJsonRequest<{ items: UpstreamCatalogOfferCard[] }>(event, {
      headers,
      method: "GET",
      url: `${resolveServiceBaseUrl(runtimeConfig.commercialCatalogServiceBaseUrl, "http://localhost:8007")}/v1/public/catalog/offers`
    })
  ]);

  if (!Array.isArray(courses)) {
    return courses;
  }

  if (typeof catalog !== "object" || catalog === null || !Array.isArray(catalog.items)) {
    return catalog;
  }

  const coursesById = new Map(courses.map((item) => [item.course_id, item]));

  return {
    items: catalog.items
      .map((item) => {
        const course = coursesById.get(item.course_id);
        if (!course) {
          return null;
        }

        return {
          courseId: item.course_id,
          description: course.description ?? item.description_short,
          id: resolveCourseRouteId(course.slug, item.course_id),
          lessonsCount: item.lessons_count,
          level: item.level,
          offer: {
            descriptionShort: item.default_offer.description_short,
            featureFlags: {
              deliveryMode: item.default_offer.feature_flags.delivery_mode,
              homeworkReviewIncluded: item.default_offer.feature_flags.homework_review_included,
              teacherIncluded: item.default_offer.feature_flags.teacher_included
            },
            offerCode: item.default_offer.offer_code,
            offerId: item.default_offer.offer_id,
            price: {
              currency: item.default_offer.price.currency,
              discountReason: item.default_offer.price.discount_reason,
              listPrice: item.default_offer.price.list_price,
              salePrice: item.default_offer.price.sale_price
            },
            promoLabels: item.default_offer.promo_labels.map((label) => ({
              kind: label.kind,
              label: label.label
            })),
            title: item.default_offer.title
          },
          offersCount: item.offers_count,
          title: item.title
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  };
});
