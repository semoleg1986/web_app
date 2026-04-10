import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import HeroBanner from "~/shared/ui/hero-banner/HeroBanner.vue";

describe("HeroBanner", () => {
  it("renders title and subtitle", () => {
    const wrapper = mount(HeroBanner, {
      props: {
        title: "Курс математики",
        subtitle: "Базовый уровень"
      }
    });

    expect(wrapper.text()).toContain("Курс математики");
    expect(wrapper.text()).toContain("Базовый уровень");
  });
});
