export interface PaymentIntentSnapshot {
  base_price: number;
  bonus_amount: number;
  course_id: string;
  created_at: string;
  currency: string;
  expires_at: string | null;
  final_price: number;
  offer_id: string;
  parent_id: string;
  payment_intent_id: string;
  status: string;
  student_id: string;
  updated_at: string;
  version: number;
}

export interface CourseAccessGrantSnapshot {
  access_grant_id: string;
  payment_intent_id: string;
  offer_id: string;
  course_id: string;
  student_id: string;
  status: string;
  granted_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface CheckoutActionsSnapshot {
  can_create_payment_intent: boolean;
  can_retry_payment: boolean;
}

export interface CheckoutStateSnapshot {
  parent_id: string;
  student_id: string;
  course_id: string;
  checkout_state: string;
  latest_payment_intent: PaymentIntentSnapshot | null;
  access_grant: CourseAccessGrantSnapshot | null;
  available_actions: CheckoutActionsSnapshot;
}

export interface CreatePaymentIntentPayload {
  attribution_token?: string | null;
  bonus_amount?: number | null;
  idempotency_key?: string | null;
  offer_id: string;
  parent_id: string;
  payment_intent_id?: string | null;
  student_id: string;
}
