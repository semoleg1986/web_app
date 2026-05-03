import { Buffer } from "node:buffer";
import { deleteCookie, getCookie, setCookie } from "h3";
import type { H3Event } from "h3";

const ACCESS_TOKEN_COOKIE = "curs_access_token";
const REFRESH_TOKEN_COOKIE = "curs_refresh_token";

function isSecureCookie() {
  return process.env.NODE_ENV === "production";
}

function decodeJwtPayload(token: string) {
  const [, payload = ""] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}

export function getAccessToken(event: H3Event) {
  return getCookie(event, ACCESS_TOKEN_COOKIE) ?? null;
}

export function getRefreshToken(event: H3Event) {
  return getCookie(event, REFRESH_TOKEN_COOKIE) ?? null;
}

export function getRefreshSessionId(event: H3Event) {
  const refreshToken = getRefreshToken(event);

  if (!refreshToken) {
    return null;
  }

  const payload = decodeJwtPayload(refreshToken);
  const sessionId = payload?.session_id;

  return typeof sessionId === "string" ? sessionId : null;
}

export function setAuthCookies(
  event: H3Event,
  input: { accessToken: string; expiresIn: number; refreshToken: string }
) {
  setCookie(event, ACCESS_TOKEN_COOKIE, input.accessToken, {
    httpOnly: true,
    maxAge: input.expiresIn,
    path: "/",
    sameSite: "lax",
    secure: isSecureCookie()
  });

  setCookie(event, REFRESH_TOKEN_COOKIE, input.refreshToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isSecureCookie()
  });
}

export function clearAuthCookies(event: H3Event) {
  deleteCookie(event, ACCESS_TOKEN_COOKIE, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isSecureCookie()
  });
  deleteCookie(event, REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isSecureCookie()
  });
}
