export interface OfferPromoLabel {
  kind: string;
  label: string;
}

export interface OfferPrice {
  currency: string;
  discountReason: string | null;
  listPrice: number;
  salePrice: number;
}

export interface OfferFeatureFlags {
  deliveryMode: string;
  homeworkReviewIncluded: boolean;
  teacherIncluded: boolean;
}

export interface CourseOfferItem {
  descriptionShort: string;
  featureFlags: OfferFeatureFlags;
  offerCode: string;
  offerId: string;
  price: OfferPrice;
  promoLabels: OfferPromoLabel[];
  title: string;
}

export interface CourseCardItem {
  courseId: string;
  description: string | null;
  id: string;
  lessonsCount: number;
  level: string;
  offer: CourseOfferItem;
  offersCount: number;
  title: string;
}

export interface CourseDetailsItem extends CourseCardItem {
  defaultOffer: CourseOfferItem | null;
  description: string;
  offers: CourseOfferItem[];
}
