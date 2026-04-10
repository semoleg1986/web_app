import type { HealthResponse } from "~/shared/types/health";

export function useHealthQuery() {
  return useFetch<HealthResponse>("/api/health");
}
