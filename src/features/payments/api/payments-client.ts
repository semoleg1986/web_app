import { useApiClient } from "~/shared/api/use-api-client";

export interface PaymentIntentSnapshot {
  base_price: number;
  bonus_amount: number;
  course_id: string;
  created_at: string;
  currency: string;
  expires_at: string | null;
  final_price: number;
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
  course_id: string;
  idempotency_key?: string | null;
  parent_id: string;
  payment_intent_id?: string | null;
  student_id: string;
}

export function usePaymentsClient() {
  const api = useApiClient();

  return {
    cancelPaymentIntent(paymentIntentId: string) {
      return api.post<PaymentIntentSnapshot, Record<string, never>>(
        `/parent/payments/intents/${paymentIntentId}/cancel`,
        {}
      );
    },
    createPaymentIntent(payload: CreatePaymentIntentPayload) {
      return api.post<PaymentIntentSnapshot, CreatePaymentIntentPayload>(
        "/parent/payments/intents",
        payload
      );
    },
    getPaymentIntent(paymentIntentId: string) {
      return api.get<PaymentIntentSnapshot>(`/parent/payments/intents/${paymentIntentId}`);
    }
  };
}
