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

export interface CreatePaymentIntentPayload {
  attribution_token?: string | null;
  bonus_amount?: number | null;
  idempotency_key?: string | null;
  offer_id: string;
  parent_id: string;
  payment_intent_id?: string | null;
  student_id: string;
}
