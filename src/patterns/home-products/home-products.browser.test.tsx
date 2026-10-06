import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

import "@/index.css";
import { HomeProducts } from "./home-products";

let root: Root | undefined;
let host: HTMLElement | undefined;

async function mount() {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  root.render(<HomeProducts />);
  await vi.waitFor(() =>
    expect(document.querySelector("[data-slot=product-card]")).not.toBeNull(),
  );
}

afterEach(() => {
  root?.unmount();
  host?.remove();
  root = undefined;
  host = undefined;
});

function mediaAspects() {
  return [...document.querySelectorAll("[data-slot=product-card]")].map(
    (card) => getComputedStyle(card.firstElementChild!).aspectRatio,
  );
}

describe("Home Products breakpoint", () => {
  test("uses square product media below md", async () => {
    await page.viewport(390, 844);
    await mount();
    await vi.waitFor(() => expect(mediaAspects()).toHaveLength(10));
    expect(new Set(mediaAspects())).toEqual(new Set(["1 / 1"]));
  });

  test("uses Figma layouts from md up", async () => {
    await page.viewport(1280, 800);
    await mount();
    await vi.waitFor(() => expect(mediaAspects()).toHaveLength(10));
    const aspects = mediaAspects();
    expect(aspects).toContain("644 / 389");
    expect(aspects).toContain("310 / 389");
    expect(aspects).not.toContain("1 / 1");
  });
});
