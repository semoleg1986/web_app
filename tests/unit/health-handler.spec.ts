import { describe, expect, it } from "vitest";
import healthHandler from "~/server/api/health.get";

describe("health handler", () => {
  it("returns ok payload", async () => {
    const result = await healthHandler({} as never);
    expect(result.ok).toBe(true);
    expect(result.service).toBe("web_app");
    expect(typeof result.timestamp).toBe("string");
  });
});
