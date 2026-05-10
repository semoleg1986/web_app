import {
  getQuery,
  getRequestHeader,
  readBody,
  setHeader,
  setResponseStatus
} from "h3";
import type { H3Event } from "h3";

import { getAccessToken } from "~/server/utils/auth-session";

export interface UpstreamProblem {
  correlation_id?: string;
  detail?: string;
  request_id?: string;
  status?: number;
  title?: string;
  type?: string;
  [key: string]: unknown;
}

export function resolveServiceBaseUrl(configValue: string | undefined, fallback: string) {
  return String(configValue || fallback).replace(/\/$/, "");
}

export function buildProxyHeaders(event: H3Event, options?: { includeAuth?: boolean }) {
  const headers = new Headers();
  const requestId = getRequestHeader(event, "x-request-id");
  const correlationId = getRequestHeader(event, "x-correlation-id");

  if (requestId) {
    headers.set("X-Request-ID", requestId);
  }

  if (correlationId) {
    headers.set("X-Correlation-ID", correlationId);
  }

  if (options?.includeAuth) {
    const accessToken = getAccessToken(event);

    if (!accessToken) {
      setResponseStatus(event, 401, "Unauthorized");
      return null;
    }

    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

function propagateResponseHeaders(event: H3Event, response: Response) {
  const requestId = response.headers.get("x-request-id");
  const correlationId = response.headers.get("x-correlation-id");

  if (requestId) {
    setHeader(event, "X-Request-ID", requestId);
  }

  if (correlationId) {
    setHeader(event, "X-Correlation-ID", correlationId);
  }
}

async function readResponsePayload(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as UpstreamProblem | Record<string, unknown>;
  }

  return await response.text();
}

export async function proxyJsonRequest<TResponse>(
  event: H3Event,
  input: {
    body?: unknown;
    headers: Headers;
    method: "GET" | "POST";
    url: string;
  }
): Promise<TResponse | UpstreamProblem | string> {
  const response = await fetch(input.url, {
    body: input.body === undefined ? undefined : JSON.stringify(input.body),
    headers: input.headers,
    method: input.method
  });

  propagateResponseHeaders(event, response);

  if (!response.ok) {
    setResponseStatus(event, response.status, response.statusText);
    return await readResponsePayload(response);
  }

  return (await readResponsePayload(response)) as TResponse;
}

export async function readProxyBody(event: H3Event) {
  return await readBody(event);
}

export function readProxyQuery(event: H3Event) {
  return getQuery(event);
}

export function unauthorizedProblem(): UpstreamProblem {
  return {
    detail: "Authentication required",
    status: 401,
    title: "Unauthorized",
    type: "/problems/unauthorized"
  };
}
