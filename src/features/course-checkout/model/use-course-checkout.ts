import { computed, reactive, ref, watch } from "vue";
import type { Ref } from "vue";
import { useCookie } from "#app";

import { useAuthSession } from "~/features/auth";
import type { CourseDetailsItem } from "~/features/course-catalog";
import { useParentStudentsCommands, useParentStudentsQuery } from "~/features/parent-students";
import type { ParentStudentItem } from "~/features/parent-students";
import { useCheckoutStateQuery, usePaymentsCommands } from "~/features/payments";
import { ApiRequestError } from "~/shared/api/types";
import { useSseChannel } from "~/shared/lib/realtime/use-sse-channel";

export function useCourseCheckout(course: Ref<CourseDetailsItem>) {
  const paymentsCommands = usePaymentsCommands();
  const parentStudentsCommands = useParentStudentsCommands();
  const { isAuthenticated, user } = useAuthSession();

  const isParent = computed(() => Boolean(user.value?.roles.includes("parent")));
  const studentsEnabled = computed(() => Boolean(isAuthenticated.value && isParent.value));
  const currentParentUserId = computed(() => user.value?.user_id ?? "");
  const { data: studentsData, refresh: refreshStudents } = useParentStudentsQuery(
    studentsEnabled,
    currentParentUserId
  );
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

  const canCreateStudent = computed(
    () =>
      createStudentForm.display_name.trim().length > 0 && createStudentForm.email.trim().length > 0
  );

  const { data: checkoutStateData, refresh: refreshCheckoutState } = useCheckoutStateQuery(
    selectedStudentId,
    courseKey
  );

  const streamUrl = computed(() =>
    selectedStudentId.value
      ? `/api/parent/payments/students/${selectedStudentId.value}/courses/${courseKey.value}/checkout-state/stream`
      : ""
  );

  const isSseRefreshBlocked = computed(() => checkoutPending.value || createStudentPending.value);

  watch(isSseRefreshBlocked, async (blocked) => {
    if (blocked || !sseRefreshQueued.value) {
      return;
    }
    sseRefreshQueued.value = false;
    await refreshCheckoutState();
  });

  useSseChannel(streamUrl, {
    onMessage: async () => {
      if (isSseRefreshBlocked.value) {
        sseRefreshQueued.value = true;
        return;
      }
      await refreshCheckoutState();
    }
  });

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
      await paymentsCommands.createPaymentIntent({
        idempotency_key: `web-offer-${course.value.defaultOffer.offerId}-${selectedStudentId.value}`,
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
