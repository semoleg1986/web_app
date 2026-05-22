import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import type { Ref } from "vue";
import { useCookie } from "#app";

import { useAuthSession } from "~/features/auth";
import type { CourseDetailsItem } from "~/features/course-catalog";
import { useParentStudentsCommands, useParentStudentsQuery } from "~/features/parent-students";
import type { ParentStudentItem } from "~/features/parent-students";
import { useCheckoutStateQuery, usePaymentsCommands } from "~/features/payments";
import { ApiRequestError } from "~/shared/api/types";
import { useSseChannel } from "~/shared/lib/realtime/use-sse-channel";

const CHECKOUT_REFRESH_POLL_INTERVAL_MS = 5000;

export function useCourseCheckout(course: Ref<CourseDetailsItem>) {
  const paymentsCommands = usePaymentsCommands();
  const parentStudentsCommands = useParentStudentsCommands();
  const { initialized, isAuthenticated, user } = useAuthSession();

  const isParent = computed(() => Boolean(user.value?.roles.includes("parent")));
  const studentsEnabled = computed(() => Boolean(isAuthenticated.value && isParent.value));
  const currentParentUserId = computed(() => user.value?.user_id ?? "");
  const {
    data: studentsData,
    pending: studentsPending,
    refresh: refreshStudents
  } = useParentStudentsQuery(studentsEnabled, currentParentUserId);
  const selectedStudentsCookie = useCookie<Record<string, string>>("curs_checkout_students", {
    default: () => ({})
  });

  const students = computed<ParentStudentItem[]>(() => studentsData.value?.items ?? []);
  const courseKey = computed(() => course.value.courseId);
  const selectedStudentId = ref("");
  const showCreateStudentForm = ref(false);
  const createStudentPending = ref(false);
  const createStudentError = ref("");
  const createStudentSuccess = ref(false);
  const createStudentForm = reactive({
    display_name: "",
    email: "",
    phone: ""
  });
  const checkoutPending = ref(false);
  const checkoutError = ref("");
  const sseRefreshQueued = ref(false);
  let refreshPollTimer: ReturnType<typeof setInterval> | null = null;

  const canCreateStudent = computed(
    () =>
      createStudentForm.display_name.trim().length > 0 && createStudentForm.email.trim().length > 0
  );

  const checkoutStateEnabled = computed(
    () =>
      initialized.value &&
      studentsEnabled.value &&
      !studentsPending.value &&
      selectedStudentId.value.trim().length > 0 &&
      courseKey.value.trim().length > 0
  );

  const { data: checkoutStateData, refresh: refreshCheckoutState } = useCheckoutStateQuery(
    selectedStudentId,
    courseKey,
    checkoutStateEnabled
  );

  const streamUrl = computed(() =>
    checkoutStateEnabled.value
      ? `/api/parent/payments/students/${selectedStudentId.value}/courses/${courseKey.value}/checkout-state/stream`
      : ""
  );

  const isSseRefreshBlocked = computed(() => checkoutPending.value || createStudentPending.value);

  async function refreshCheckoutStateSafely() {
    if (isSseRefreshBlocked.value) {
      sseRefreshQueued.value = true;
      return;
    }
    await refreshCheckoutState();
  }

  watch(isSseRefreshBlocked, async (blocked) => {
    if (blocked || !sseRefreshQueued.value) {
      return;
    }
    sseRefreshQueued.value = false;
    await refreshCheckoutState();
  });

  useSseChannel(streamUrl, {
    onError: () => {
      void refreshCheckoutStateSafely();
    },
    onMessage: () => {
      void refreshCheckoutStateSafely();
    }
  });

  function stopRefreshPolling() {
    if (refreshPollTimer !== null) {
      clearInterval(refreshPollTimer);
      refreshPollTimer = null;
    }
  }

  function startRefreshPolling() {
    stopRefreshPolling();
    refreshPollTimer = setInterval(() => {
      void refreshCheckoutStateSafely();
    }, CHECKOUT_REFRESH_POLL_INTERVAL_MS);
  }

  if (import.meta.client) {
    watch(
      checkoutStateEnabled,
      (enabled) => {
        if (!enabled) {
          stopRefreshPolling();
          return;
        }
        startRefreshPolling();
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      stopRefreshPolling();
    });
  }

  const checkoutState = computed(() => checkoutStateData.value ?? null);
  const paymentIntent = computed(() => checkoutState.value?.latest_payment_intent ?? null);
  const accessGrant = computed(() => checkoutState.value?.access_grant ?? null);
  const selectedOffer = computed(() => checkoutState.value?.selected_offer ?? null);
  const purchasedOffer = computed(() => checkoutState.value?.purchased_offer ?? null);
  const nextAction = computed(
    () => checkoutState.value?.available_actions.next_action ?? "create_payment_intent"
  );

  watch(
    students,
    (next) => {
      if (next.length === 0) {
        selectedStudentId.value = "";
        return;
      }

      const hasSelectedStudent = next.some(
        (student) => student.user_id === selectedStudentId.value
      );
      if (hasSelectedStudent) {
        return;
      }

      const persistedStudentId = selectedStudentsCookie.value[courseKey.value];
      selectedStudentId.value =
        next.find((student) => student.user_id === persistedStudentId)?.user_id ?? next[0].user_id;
    },
    { immediate: true }
  );

  watch(currentParentUserId, () => {
    selectedStudentId.value = "";
  });

  watch(selectedStudentId, (next) => {
    if (next) {
      selectedStudentsCookie.value = {
        ...selectedStudentsCookie.value,
        [courseKey.value]: next
      };
    }
  });

  async function createStudent() {
    if (!canCreateStudent.value) {
      return;
    }

    createStudentPending.value = true;
    createStudentError.value = "";
    createStudentSuccess.value = false;

    try {
      const created = await parentStudentsCommands.createMyStudent({
        display_name: createStudentForm.display_name.trim(),
        email: createStudentForm.email.trim(),
        phone: createStudentForm.phone.trim() || null
      });
      await refreshStudents();
      selectedStudentId.value = created.user_id;
      createStudentForm.display_name = "";
      createStudentForm.email = "";
      createStudentForm.phone = "";
      createStudentSuccess.value = true;
      showCreateStudentForm.value = false;
      await refreshCheckoutState();
    } catch (error) {
      createStudentError.value =
        error instanceof ApiRequestError ? error.message : "Failed to create child";
    } finally {
      createStudentPending.value = false;
    }
  }

  async function createIntent() {
    if (!user.value || !course.value.defaultOffer || !selectedStudentId.value) {
      return;
    }

    checkoutPending.value = true;
    checkoutError.value = "";

    try {
      const idempotencySuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await paymentsCommands.createPaymentIntent({
        idempotency_key:
          `web-offer-${course.value.defaultOffer.offerId}-${selectedStudentId.value}` +
          `-${idempotencySuffix}`,
        offer_id: course.value.defaultOffer.offerId,
        parent_id: user.value.user_id,
        student_id: selectedStudentId.value
      });
      await refreshCheckoutState();
    } catch (error) {
      checkoutError.value =
        error instanceof ApiRequestError ? error.message : "Failed to create payment intent";
    } finally {
      checkoutPending.value = false;
    }
  }

  function updateCreateStudentField(field: "display_name" | "email" | "phone", value: string) {
    createStudentForm[field] = value;
  }

  return {
    accessGrant,
    canCreateStudent,
    checkoutError,
    checkoutPending,
    checkoutState,
    createIntent,
    createStudent,
    createStudentError,
    createStudentForm,
    createStudentPending,
    createStudentSuccess,
    isAuthenticated,
    isParent,
    nextAction,
    paymentIntent,
    purchasedOffer,
    selectedStudentId,
    selectedOffer,
    showCreateStudentForm,
    students,
    updateCreateStudentField,
    user
  };
}
