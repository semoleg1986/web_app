import { getHeader, getRequestHeader, readBody, setHeader, setResponseStatus } from "h3";
import type { H3Event } from "h3";

import {
  clearAuthCookies,
  getAccessToken,
  getRefreshSessionId,
  getRefreshToken,
  setAuthCookies
} from "~/server/utils/auth-session";

interface AuthTokenPairResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: "Bearer";
}

interface AuthMeResponse {
  account_id: string;
  user_id: string;
  email: string;
  roles: Array<"admin" | "teacher" | "parent" | "student">;
  status: "active" | "blocked" | "archived";
}

async function fetchMeWithAccessToken(
  event: H3Event,
  accessToken: string
): Promise<AuthMeResponse | Record<string, unknown>> {
  const headers = new Headers();
  forwardTracingHeaders(event, headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${authServiceBaseUrl()}/v1/auth/me`, {
    headers,
    method: "GET"
  });

  if (!response.ok) {
    return await forwardUpstreamError(event, response);
  }

  const requestId = response.headers.get("x-request-id");
  const correlationId = response.headers.get("x-correlation-id");

  if (requestId) {
    setHeader(event, "X-Request-ID", requestId);
  }

  if (correlationId) {
    setHeader(event, "X-Correlation-ID", correlationId);
  }

  return (await response.json()) as AuthMeResponse;
}

function authServiceBaseUrl() {
  const runtimeConfig = useRuntimeConfig();

  return String(
    runtimeConfig.authServiceBaseUrl || runtimeConfig.public.apiBaseUrl || "http://localhost:8000"
  ).replace(/\/$/, "");
}

function forwardTracingHeaders(event: H3Event, headers: Headers) {
  const requestId = getRequestHeader(event, "x-request-id");
  const correlationId = getRequestHeader(event, "x-correlation-id");

  if (requestId) {
    headers.set("X-Request-ID", requestId);
  }

  if (correlationId) {
    headers.set("X-Correlation-ID", correlationId);
  }
}

async function forwardUpstreamError(event: H3Event, response: Response) {
  const requestId = response.headers.get("x-request-id");
  const correlationId = response.headers.get("x-correlation-id");

  if (requestId) {
    setHeader(event, "X-Request-ID", requestId);
  }

  if (correlationId) {
    setHeader(event, "X-Correlation-ID", correlationId);
  }

  setResponseStatus(event, response.status, response.statusText);

  return await response.json();
}

async function exchangeRefreshToken(event: H3Event) {
  const refreshToken = getRefreshToken(event);

  if (!refreshToken) {
    return null;
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  forwardTracingHeaders(event, headers);

  const response = await fetch(`${authServiceBaseUrl()}/v1/auth/refresh`, {
    body: JSON.stringify({ refresh_token: refreshToken }),
    headers,
    method: "POST"
  });

  if (!response.ok) {
    clearAuthCookies(event);
    return null;
  }

  const tokenPair = (await response.json()) as AuthTokenPairResponse;
  setAuthCookies(event, {
    accessToken: tokenPair.access_token,
    expiresIn: tokenPair.expires_in,
    refreshToken: tokenPair.refresh_token
  });

  return tokenPair;
}

export async function proxyLogin(event: H3Event) {
  const body = await readBody(event);
  const headers = new Headers({ "Content-Type": "application/json" });
  const userAgent = getHeader(event, "user-agent");

  forwardTracingHeaders(event, headers);

  const payload =
    typeof body === "object" && body !== null
      ? {
          ...body,
          user_agent_raw:
            typeof (body as Record<string, unknown>).user_agent_raw === "string"
              ? (body as Record<string, string>).user_agent_raw
              : (userAgent ?? undefined)
        }
      : body;

  const response = await fetch(`${authServiceBaseUrl()}/v1/auth/login`, {
    body: JSON.stringify(payload),
    headers,
    method: "POST"
  });

  if (!response.ok) {
    return await forwardUpstreamError(event, response);
  }

  const tokenPair = (await response.json()) as AuthTokenPairResponse;
  setAuthCookies(event, {
    accessToken: tokenPair.access_token,
    expiresIn: tokenPair.expires_in,
    refreshToken: tokenPair.refresh_token
  });

  const meResponse = await fetchMeWithAccessToken(event, tokenPair.access_token);

  if ("account_id" in (meResponse as Record<string, unknown>)) {
    return {
      expires_in: tokenPair.expires_in,
      token_type: tokenPair.token_type,
      user: meResponse
    };
  }

  return meResponse;
}

export async function proxyMe(event: H3Event): Promise<AuthMeResponse | Record<string, unknown>> {
  const headers = new Headers();
  forwardTracingHeaders(event, headers);

  let accessToken = getAccessToken(event);

  if (!accessToken) {
    setResponseStatus(event, 401, "Unauthorized");
    return {
      detail: "Authentication required",
      status: 401,
      title: "Unauthorized",
      type: "/problems/unauthorized"
    };
  }

  headers.set("Authorization", `Bearer ${accessToken}`);

  let response = await fetch(`${authServiceBaseUrl()}/v1/auth/me`, {
    headers,
    method: "GET"
  });

  if (response.status === 401) {
    const refreshed = await exchangeRefreshToken(event);

    if (!refreshed) {
      setResponseStatus(event, 401, "Unauthorized");
      return {
        detail: "Authentication required",
        status: 401,
        title: "Unauthorized",
        type: "/problems/unauthorized"
      };
    }

    accessToken = refreshed.access_token;
    headers.set("Authorization", `Bearer ${accessToken}`);
    response = await fetch(`${authServiceBaseUrl()}/v1/auth/me`, {
      headers,
      method: "GET"
    });
  }

  if (!response.ok) {
    return await forwardUpstreamError(event, response);
  }

  const requestId = response.headers.get("x-request-id");
  const correlationId = response.headers.get("x-correlation-id");

  if (requestId) {
    setHeader(event, "X-Request-ID", requestId);
  }

  if (correlationId) {
    setHeader(event, "X-Correlation-ID", correlationId);
  }

  return (await response.json()) as AuthMeResponse;
}

export async function proxyLogout(event: H3Event) {
  const accessToken = getAccessToken(event);
  const sessionId = getRefreshSessionId(event);
  const headers = new Headers({ "Content-Type": "application/json" });

  forwardTracingHeaders(event, headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (accessToken && sessionId) {
    await fetch(`${authServiceBaseUrl()}/v1/auth/logout`, {
      body: JSON.stringify({ session_id: sessionId }),
      headers,
      method: "POST"
    }).catch(() => undefined);
  }

  clearAuthCookies(event);
  setResponseStatus(event, 204);
  return null;
}

export async function proxyRegister(event: H3Event) {
  const body = await readBody(event);
  const headers = new Headers({ "Content-Type": "application/json" });
  forwardTracingHeaders(event, headers);

  const response = await fetch(`${authServiceBaseUrl()}/v1/auth/register`, {
    body: JSON.stringify(body),
    headers,
    method: "POST"
  });

  if (!response.ok) {
    return await forwardUpstreamError(event, response);
  }

  const requestId = response.headers.get("x-request-id");
  const correlationId = response.headers.get("x-correlation-id");

  if (requestId) {
    setHeader(event, "X-Request-ID", requestId);
  }

  if (correlationId) {
    setHeader(event, "X-Correlation-ID", correlationId);
  }

  return await response.json();
}
