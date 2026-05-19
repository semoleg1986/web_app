import { describe, expect, it } from "vitest";

import { normalizeApiError, resolveApiUrl } from "~/shared/api/http";

describe("shared api helpers", () => {
  it("prefixes relative paths with configured base url", () => {
    expect(resolveApiUrl("/health")).toBe("/api/health");
    expect(resolveApiUrl("courses", "/internal-api")).toBe("/internal-api/courses");
  });

  it("preserves explicit api and absolute urls", () => {
    expect(resolveApiUrl("/api/courses")).toBe("/api/courses");
    expect(resolveApiUrl("https://example.com/health")).toBe("https://example.com/health");
  });

  it("normalizes problem-details payloads into stable ui errors", () => {
    const normalized = normalizeApiError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Forbidden",
      data: {
        detail: "Access denied",
        request_id: "req-web-001",
        correlation_id: "corr-web-001",
        status: 403,
        title: "Forbidden",
        type: "/problems/access-denied"
      }
    } as never);

    expect(normalized).toEqual({
      statusCode: 403,
      statusMessage: "Access denied",
      problem: {
        detail: "Access denied",
        request_id: "req-web-001",
        correlation_id: "corr-web-001",
        status: 403,
        title: "Forbidden",
        type: "/problems/access-denied"
      },
      requestId: "req-web-001",
      correlationId: "corr-web-001"
    });
  });
});
