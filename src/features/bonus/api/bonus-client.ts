import { useApiClient } from "~/shared/api/use-api-client";

export interface BonusBalanceSnapshot {
  balance: number;
  parent_id: string;
  updated_at: string;
  version: number;
}

export interface BonusLedgerEntry {
  balance_after: number;
  created_at: string;
  delta: number;
  entry_id: string;
  idempotency_key: string | null;
  operation: string;
  parent_id: string;
  reason_code: string;
  reference_id: string | null;
}

export interface BonusLedgerQuery {
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
  operation?: string;
  reason_code?: string;
}

function toQueryString(input: BonusLedgerQuery) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    params.set(key, String(value));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function useBonusClient() {
  const api = useApiClient();

  return {
    getParentBalance() {
      return api.get<BonusBalanceSnapshot>("/parent/bonus/balance");
    },
    getParentLedger(query: BonusLedgerQuery = {}) {
      return api.get<BonusLedgerEntry[]>(`/parent/bonus/ledger${toQueryString(query)}`);
    }
  };
}
