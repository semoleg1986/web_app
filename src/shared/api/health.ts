import { useApiQuery } from "~/shared/api/use-api-query";
import type { HealthResponse } from "~/shared/types/health";

export function useHealthQuery() {
  return useApiQuery<HealthResponse>("/health");
}
