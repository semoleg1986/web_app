import type {
  AuthLoginPayload,
  AuthMe,
  AuthRegisterPayload
} from "~/features/auth/model/types";
import { useAuthClient } from "~/features/auth/api/auth-client";
import { ApiRequestError } from "~/shared/api/types";

interface AuthSessionState {
  error: ApiRequestError | null;
  initialized: boolean;
  pending: boolean;
  user: AuthMe | null;
}

export function useAuthSession() {
  const authClient = useAuthClient();
  const state = useState<AuthSessionState>("auth-session", () => ({
    error: null,
    initialized: false,
    pending: false,
    user: null
  }));

  const isAuthenticated = computed(() => state.value.user !== null);

  async function bootstrap() {
    if (state.value.pending) {
      return state.value.user;
    }

    state.value.pending = true;
    state.value.error = null;

    try {
      const user = await authClient.getCurrentUser();
      state.value.user = user;
      return user;
    } catch (error) {
      if (error instanceof ApiRequestError && error.statusCode === 401) {
        state.value.user = null;
        return null;
      }

      state.value.error = error as ApiRequestError;
      state.value.user = null;
      throw error;
    } finally {
      state.value.pending = false;
      state.value.initialized = true;
    }
  }

  async function login(payload: AuthLoginPayload) {
    state.value.pending = true;
    state.value.error = null;

    try {
      const session = await authClient.login(payload);
      await authClient.ensureMyProfile({
        email: session.user.email
      });
      state.value.user = session.user;
      state.value.initialized = true;
      return session;
    } catch (error) {
      state.value.error = error as ApiRequestError;
      throw error;
    } finally {
      state.value.pending = false;
    }
  }

  async function register(payload: AuthRegisterPayload) {
    state.value.pending = true;
    state.value.error = null;

    try {
      const registered = await authClient.register(payload);
      return registered;
    } catch (error) {
      state.value.error = error as ApiRequestError;
      throw error;
    } finally {
      state.value.pending = false;
    }
  }

  async function logout() {
    state.value.pending = true;
    state.value.error = null;

    try {
      await authClient.logout();
      state.value.user = null;
      state.value.initialized = true;
    } catch (error) {
      state.value.error = error as ApiRequestError;
      throw error;
    } finally {
      state.value.pending = false;
    }
  }

  return {
    bootstrap,
    error: computed(() => state.value.error),
    initialized: computed(() => state.value.initialized),
    isAuthenticated,
    login,
    logout,
    pending: computed(() => state.value.pending),
    register,
    user: computed(() => state.value.user)
  };
}
