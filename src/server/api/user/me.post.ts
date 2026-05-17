import {
  buildProxyHeaders,
  proxyJsonRequest,
  readProxyBody,
  resolveServiceBaseUrl,
  unauthorizedProblem
} from "~/server/utils/upstream-proxy";

interface EnsureMyProfilePayload {
  display_name?: string | null;
  email: string;
  phone?: string | null;
}

interface UserProfileResponse {
  created_at: string;
  display_name: string;
  email: string;
  phone: string | null;
  roles: string[];
  status: string;
  updated_at: string;
  user_id: string;
  version: number;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = buildProxyHeaders(event, { includeAuth: true });

  if (!headers) {
    return unauthorizedProblem();
  }

  headers.set("Content-Type", "application/json");
  const body = await readProxyBody(event);

  return await proxyJsonRequest<UserProfileResponse>(event, {
    body: body as EnsureMyProfilePayload,
    headers,
    method: "POST",
    url: `${resolveServiceBaseUrl(runtimeConfig.usersServiceBaseUrl, "http://localhost:8002")}/v1/user/me`
  });
});
