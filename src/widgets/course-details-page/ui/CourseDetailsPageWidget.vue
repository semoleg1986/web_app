<template>
  <main class="course-page">
    <AppShellSection class="course-page__sidebar" scroll="hidden">
      <template #header>
        <div class="course-page__nav">
          <NuxtLink class="back-link" to="/">{{ t("course.back") }}</NuxtLink>
          <p class="course-page__label">{{ t("catalog.title") }}</p>
        </div>
      </template>

      <div class="course-page__summary">
        <h1>{{ course.title }}</h1>
        <p>{{ t(`catalog.level.${normalizeCourseLevel(course.level)}`) }}</p>
        <strong>{{ t("catalog.lessons") }}: {{ course.lessonsCount }}</strong>
        <strong v-if="course.defaultOffer">
          {{ t("catalog.price") }}: {{ formatPrice(course.defaultOffer.price) }}
        </strong>
      </div>

      <AppCard class="checkout-card">
        <h2>{{ t("course.checkout.title") }}</h2>

        <p v-if="!isAuthenticated">{{ t("course.checkout.loginRequired") }}</p>
        <p v-else-if="!isParent">{{ t("course.checkout.parentOnly") }}</p>
        <p v-else-if="!course.defaultOffer">{{ t("course.checkout.noOffer") }}</p>
        <p v-else-if="students.length === 0">{{ t("course.checkout.noStudents") }}</p>
        <div v-else class="checkout-card__form">
          <AppFormField :label="t('course.checkout.student')">
            <select v-model="selectedStudentId">
              <option v-for="student in students" :key="student.user_id" :value="student.user_id">
                {{ student.display_name }}
              </option>
            </select>
          </AppFormField>

          <AppButton :disabled="checkoutPending || !selectedStudentId" block @click="createIntent">
            {{ checkoutPending ? t("course.checkout.pending") : t("course.checkout.submit") }}
          </AppButton>

          <p v-if="checkoutError" class="checkout-card__error">{{ checkoutError }}</p>

          <div v-if="paymentIntent" class="checkout-card__success">
            <strong>{{ t("course.checkout.success") }}</strong>
            <p>{{ t("course.checkout.intent") }}: {{ paymentIntent.payment_intent_id }}</p>
            <p>{{ t("course.checkout.total") }}: {{ formatMoney(paymentIntent.final_price, paymentIntent.currency) }}</p>
          </div>
        </div>
      </AppCard>
    </AppShellSection>

    <AppShellSection class="course-page__content" :title="t('course.description')">
      <CourseDetailsCard :course="course" />
    </AppShellSection>
  </main>
</template>

<script setup lang="ts">
import { useCourseDetailsQuery } from "~/features/course-catalog/api/use-course-details-query";
import { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";
import type { CourseDetailsItem } from "~/features/course-catalog/model/types";
import { CourseDetailsCard } from "~/features/course-catalog";
import { useAuthSession } from "~/features/auth";
import { useParentStudentsQuery } from "~/features/parent-students";
import type { ParentStudentItem } from "~/features/parent-students";
import {
  type PaymentIntentSnapshot,
  usePaymentsClient
} from "~/features/payments/api/payments-client";
import { ApiRequestError } from "~/shared/api/types";
import { buildCourseTitle } from "~/shared/lib/seo/build-course-title";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppButton from "~/shared/ui/app-button/AppButton.vue";
import AppCard from "~/shared/ui/app-card/AppCard.vue";
import AppFormField from "~/shared/ui/app-form-field/AppFormField.vue";
import AppShellSection from "~/shared/ui/app-shell-section/AppShellSection.vue";

const route = useRoute();
const { t } = usePreferences();
const runtimeConfig = useRuntimeConfig();
const routeParam = route.params.id;
const slug = Array.isArray(routeParam) ? routeParam[0] : routeParam;
const paymentsClient = usePaymentsClient();
const { isAuthenticated, user } = useAuthSession();

if (!slug) {
  throw createError({ statusCode: 404, statusMessage: "Course not found" });
}

const { data, error } = await useCourseDetailsQuery(slug);

if (error.value || !data.value?.item) {
  throw createError({ statusCode: 404, statusMessage: "Course not found" });
}

const course = computed<CourseDetailsItem>(() => data.value!.item);
const isParent = computed(() => Boolean(user.value?.roles.includes("parent")));
const studentsEnabled = computed(() => Boolean(isAuthenticated.value && isParent.value));
const { data: studentsData } = await useParentStudentsQuery(studentsEnabled.value);
const students = computed<ParentStudentItem[]>(() => studentsData.value?.items ?? []);
const selectedStudentId = ref("");
const checkoutPending = ref(false);
const checkoutError = ref("");
const paymentIntent = ref<PaymentIntentSnapshot | null>(null);

watch(
  students,
  (next) => {
    if (!selectedStudentId.value && next.length > 0) {
      selectedStudentId.value = next[0].user_id;
    }
  },
  { immediate: true }
);

const siteUrl = computed(() => String(runtimeConfig.public.siteUrl || "http://localhost:3000"));
const courseUrl = computed(() => `${siteUrl.value}/courses/${course.value.id}`);
const courseTitle = computed(() => buildCourseTitle(course.value.title));
const formatPrice = (price: CourseDetailsItem["offers"][number]["price"]) =>
  new Intl.NumberFormat(undefined, {
    currency: price.currency,
    maximumFractionDigits: 0,
    style: "currency"
  }).format(price.salePrice);
const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    currency,
    maximumFractionDigits: 0,
    style: "currency"
  }).format(amount);

async function createIntent() {
  if (!user.value || !course.value.defaultOffer || !selectedStudentId.value) {
    return;
  }

  checkoutPending.value = true;
  checkoutError.value = "";
  paymentIntent.value = null;

  try {
    paymentIntent.value = await paymentsClient.createPaymentIntent({
      idempotency_key: `web-offer-${course.value.defaultOffer.offerId}-${selectedStudentId.value}`,
      offer_id: course.value.defaultOffer.offerId,
      parent_id: user.value.user_id,
      student_id: selectedStudentId.value
    });
  } catch (error) {
    checkoutError.value =
      error instanceof ApiRequestError ? error.message : "Failed to create payment intent";
  } finally {
    checkoutPending.value = false;
  }
}

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
      offers: course.value.defaultOffer
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

useSeoMeta({
  title: courseTitle,
  description: () => course.value.description,
  ogTitle: courseTitle,
  ogDescription: () => course.value.description,
  ogType: "website",
  ogUrl: courseUrl,
  twitterTitle: courseTitle,
  twitterDescription: () => course.value.description
});

useHead(() => ({
  script: [
    {
      id: "ld-json-course",
      type: "application/ld+json",
      textContent: JSON.stringify(courseSchema.value)
    }
  ]
}));
</script>

<style scoped>
.course-page {
  max-width: 1260px;
  height: 100%;
  min-height: 0;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(18rem, 22rem) minmax(0, 1fr);
}

.back-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  color: inherit;
  text-decoration: none;
}

.course-page__sidebar,
.course-page__content {
  min-height: 0;
}

.course-page__nav {
  display: grid;
  gap: 0.45rem;
}

.course-page__label {
  margin: 0;
  color: var(--c-muted);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.course-page__summary {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.course-page__summary h1,
.course-page__summary p,
.course-page__summary strong {
  margin: 0;
}

.checkout-card {
  padding: 1rem;
}

.checkout-card__form {
  display: grid;
  gap: 0.75rem;
}

.checkout-card__error {
  color: #c0392b;
}

.checkout-card__success {
  display: grid;
  gap: 0.25rem;
}

.checkout-card__success p,
.checkout-card h2,
.checkout-card p,
.checkout-card strong {
  margin: 0;
}

@media (max-width: 1023px) {
  .course-page {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .course-page {
    padding: 0.75rem 0.75rem 0;
    gap: 0.75rem;
  }
}
</style>
