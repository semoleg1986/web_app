import { describe, expect, it } from "vitest";
import { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";

describe("normalizeCourseLevel", () => {
  it("maps known levels to normalized codes", () => {
    expect(normalizeCourseLevel("beginner")).toBe("beginner");
    expect(normalizeCourseLevel("intermediate")).toBe("intermediate");
    expect(normalizeCourseLevel("advanced")).toBe("advanced");
  });

  it("returns unknown for unsupported levels", () => {
    expect(normalizeCourseLevel("expert")).toBe("unknown");
  });
});
