import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

import { useApiQuery } from "~/shared/api/use-api-query";
import type { PaymentIntentSnapshot } from "~/features/payments/model/types";

export function usePaymentIntentQuery(
  paymentIntentId: MaybeRefOrGetter<string | null | undefined>
) {
  const resolvedPaymentIntentId = computed(() => toValue(paymentIntentId)?.trim() || "");

  return useApiQuery<PaymentIntentSnapshot>(
    computed(() => `/parent/payments/intents/${resolvedPaymentIntentId.value}`),
    {
      immediate: computed(() => resolvedPaymentIntentId.value.length > 0),
      key: computed(() =>
        resolvedPaymentIntentId.value.length > 0
          ? `GET:/parent/payments/intents/${resolvedPaymentIntentId.value}`
          : "GET:/parent/payments/intents/__empty__"
      ),
      server: false,
      watch: [resolvedPaymentIntentId]
    }
  );
}
