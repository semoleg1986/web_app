import { createError } from "h3";

import {
  buildProxyHeaders,
  proxyJsonRequest,
  resolveServiceBaseUrl
} from "~/server/utils/upstream-proxy";
import { resolveCourseRouteId } from "~/features/course-catalog/model/resolve-course-route-id";

interface UpstreamPublicCourseDetails {
  course_id: string;
  description: string | null;
  lessons_total: number;
  level: string;
  slug: string;
  title: string;
}

interface UpstreamOfferResponse {
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
}

interface UpstreamCourseOffersResponse {
  course: {
    course_id: string;
    description: string;
    level: string;
    title: string;
  };
  offers: UpstreamOfferResponse[];
}

interface UpstreamCatalogOfferCard {
  course_id: string;
  default_offer: UpstreamOfferResponse;
}

function normalizeOffer(offer: UpstreamOfferResponse) {
  return {
    descriptionShort: offer.description_short,
    featureFlags: {
      deliveryMode: offer.feature_flags.delivery_mode,
      homeworkReviewIncluded: offer.feature_flags.homework_review_included,
      teacherIncluded: offer.feature_flags.teacher_included
    },
    offerCode: offer.offer_code,
    offerId: offer.offer_id,
    price: {
      currency: offer.price.currency,
      discountReason: offer.price.discount_reason,
      listPrice: offer.price.list_price,
      salePrice: offer.price.sale_price
    },
    promoLabels: offer.promo_labels.map((label) => ({
      kind: label.kind,
      label: label.label
    })),
    title: offer.title
  };
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "id");
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Course id is required" });
  }

  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event) ?? new Headers();

  const course = await proxyJsonRequest<UpstreamPublicCourseDetails>(event, {
    headers,
    method: "GET",
    url: `${resolveServiceBaseUrl(runtimeConfig.courseServiceBaseUrl, "http://localhost:8001")}/v1/public/courses/${slug}`
  });

  if (typeof course !== "object" || course === null || !("course_id" in course)) {
    return course;
  }

  const [offers, catalog] = await Promise.all([
    proxyJsonRequest<UpstreamCourseOffersResponse>(event, {
      headers,
      method: "GET",
      url: `${resolveServiceBaseUrl(runtimeConfig.commercialCatalogServiceBaseUrl, "http://localhost:8007")}/v1/public/courses/${course.course_id}/offers`
    }),
    proxyJsonRequest<{ items: UpstreamCatalogOfferCard[] }>(event, {
      headers,
      method: "GET",
      url: `${resolveServiceBaseUrl(runtimeConfig.commercialCatalogServiceBaseUrl, "http://localhost:8007")}/v1/public/catalog/offers`
    })
  ]);

  if (typeof offers !== "object" || offers === null || !Array.isArray(offers.offers)) {
    return offers;
  }

  if (typeof catalog !== "object" || catalog === null || !Array.isArray(catalog.items)) {
    return catalog;
  }

  const normalizedOffers = offers.offers.map(normalizeOffer);
  const defaultCatalogOffer = catalog.items.find(
    (item) => item.course_id === course.course_id
  )?.default_offer;

  return {
    item: {
      courseId: course.course_id,
      defaultOffer: defaultCatalogOffer
        ? normalizeOffer(defaultCatalogOffer)
        : (normalizedOffers[0] ?? null),
      description: course.description ?? "",
      id: resolveCourseRouteId(course.slug, course.course_id),
      lessonsCount: course.lessons_total,
      level: course.level,
      offers: normalizedOffers,
      title: course.title
    }
  };
});
