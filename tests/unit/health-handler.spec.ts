import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("health handler", () => {
  it("returns ok payload", async () => {
    vi.stubGlobal("defineEventHandler", (handler: typeof Function) => handler);
    const { default: healthHandler } = await import("~/server/api/health.get");
    const result = await healthHandler({} as never);
    expect(result.ok).toBe(true);
    expect(result.service).toBe("web_app");
    expect(typeof result.timestamp).toBe("string");
  });
});
