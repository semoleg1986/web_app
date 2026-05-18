import { useApiClient } from "~/shared/api/use-api-client";
import type {
  CreatePaymentIntentPayload,
  PaymentIntentSnapshot
} from "~/features/payments/model/types";

export function usePaymentsCommands() {
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
    }
  };
}
