import { describe, expect, it } from "vitest";
import { buildCourseTitle } from "~/shared/lib/seo/build-course-title";

describe("buildCourseTitle", () => {
  it("builds seo title with suffix", () => {
    expect(buildCourseTitle("Алгебра")).toBe("Алгебра | Curs Platform");
  });
});
