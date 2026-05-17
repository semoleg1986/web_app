import type {
  AuthLoginPayload,
  AuthMe,
  AuthRegisterPayload,
  AuthSessionSnapshot
} from "~/features/auth/model/types";
import { useApiClient } from "~/shared/api/use-api-client";

export function useAuthClient() {
  const api = useApiClient();

  return {
    ensureMyProfile(payload: {
      display_name?: string | null;
      email: string;
      phone?: string | null;
    }) {
      return api.post<unknown, { display_name?: string | null; email: string; phone?: string | null }>(
        "/user/me",
        payload
      );
    },
    getCurrentUser() {
      return api.get<AuthMe>("/auth/me");
    },
    login(payload: AuthLoginPayload) {
      return api.post<AuthSessionSnapshot, AuthLoginPayload>("/auth/login", payload);
    },
    logout() {
      return api.post<void, Record<string, never>>("/auth/logout", {});
    },
    register(payload: AuthRegisterPayload) {
      return api.post<{ account_id: string; user_id: string }, AuthRegisterPayload>(
        "/auth/register",
        payload
      );
    }
  };
}
