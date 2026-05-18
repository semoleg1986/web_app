import { useAuthSession } from "~/features/auth";
import type { CourseDetailsItem } from "~/features/course-catalog";
import { useParentStudentsCommands, useParentStudentsQuery } from "~/features/parent-students";
import type { ParentStudentItem } from "~/features/parent-students";
import { usePaymentsCommands } from "~/features/payments";
import type { PaymentIntentSnapshot } from "~/features/payments";
import { ApiRequestError } from "~/shared/api/types";

export function useCourseCheckout(course: Ref<CourseDetailsItem>) {
  const paymentsCommands = usePaymentsCommands();
  const parentStudentsCommands = useParentStudentsCommands();
  const { isAuthenticated, user } = useAuthSession();

  const isParent = computed(() => Boolean(user.value?.roles.includes("parent")));
  const studentsEnabled = computed(() => Boolean(isAuthenticated.value && isParent.value));
  const { data: studentsData, refresh: refreshStudents } = useParentStudentsQuery(studentsEnabled.value);

  const students = computed<ParentStudentItem[]>(() => studentsData.value?.items ?? []);
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
  const paymentIntent = ref<PaymentIntentSnapshot | null>(null);

  const canCreateStudent = computed(
    () =>
      createStudentForm.display_name.trim().length > 0 &&
      createStudentForm.email.trim().length > 0
  );

  watch(
    students,
    (next) => {
      if (!selectedStudentId.value && next.length > 0) {
        selectedStudentId.value = next[0].user_id;
      }
    },
    { immediate: true }
  );

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
    paymentIntent.value = null;

    try {
      paymentIntent.value = await paymentsCommands.createPaymentIntent({
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

  return {
    canCreateStudent,
    checkoutError,
    checkoutPending,
    createIntent,
    createStudent,
    createStudentError,
    createStudentForm,
    createStudentPending,
    createStudentSuccess,
    isAuthenticated,
    isParent,
    paymentIntent,
    selectedStudentId,
    showCreateStudentForm,
    students,
    user
  };
}
