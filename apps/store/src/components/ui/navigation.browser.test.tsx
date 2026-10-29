import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";
import { commands, page, userEvent } from "vitest/browser";

import "@/index.css";
import {
  Navigation,
  NavigationLink,
  NavigationMenuLink,
  NavigationSection,
} from "./navigation";

declare module "vitest/browser" {
  interface BrowserCommands {
    emulateReducedMotion: (value: "reduce" | "no-preference") => Promise<void>;
  }
}

function Links({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <NavigationMenuLink key={index} href={`#item-${index}`}>
      Link {index}
    </NavigationMenuLink>
  ));
}

function Sample({
  panelLinks = 12,
  sections = 2,
}: {
  panelLinks?: number;
  sections?: number;
}) {
  const panel = (count: number) =>
    Array.from({ length: sections }, (_, index) => (
      <NavigationSection key={index} heading="Heading">
        <Links count={count} />
      </NavigationSection>
    ));

  return (
    <>
      <Navigation
        logoHref="#home"
        logoLabel="Home"
        searchLabel="Search"
        clearSearchLabel="Clear search"
        menuLabel="Menu"
        closeLabel="Close"
        backLabel="Back"
        menu={
          <>
            {Array.from({ length: sections }, (_, index) => (
              <NavigationSection key={index}>
                <Links count={panelLinks} />
              </NavigationSection>
            ))}
          </>
        }
      >
        <NavigationLink
          href="#products"
          menu={panel(panelLinks)}
          menuLabel="Products menu"
        >
          Products
        </NavigationLink>
        <NavigationLink
          href="#services"
          menu={panel(2)}
          menuLabel="Services menu"
        >
          Services
        </NavigationLink>
      </Navigation>
      <div style={{ height: 3000 }} />
    </>
  );
}

let root: Root | undefined;
let host: HTMLElement | undefined;

async function mount(ui: React.ReactNode) {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  root.render(ui);
  await vi.waitFor(() =>
    expect(document.querySelector("[data-slot=navigation]")).not.toBeNull(),
  );
}

afterEach(async () => {
  root?.unmount();
  host?.remove();
  root = undefined;
  host = undefined;
  window.scrollTo(0, 0);
  document.documentElement.style.overflow = "";
  await commands.emulateReducedMotion("no-preference");
  await page.viewport(1280, 800);
  vi.restoreAllMocks();
});

function query<T extends Element>(selector: string) {
  return document.querySelector<T>(selector);
}

function button(name: string) {
  return query<HTMLButtonElement>(`button[aria-label="${name}"]`)!;
}

function link(name: string) {
  return [...document.querySelectorAll<HTMLAnchorElement>("a")].find(
    (anchor) => anchor.textContent === name,
  )!;
}

function delayMs(element: Element) {
  const [first] = getComputedStyle(element).transitionDelay.split(",");
  return Math.round(Number.parseFloat(first) * 1000);
}

function openDesktopPanel(name: string) {
  return userEvent.hover(link(name));
}

describe("motion preference", () => {
  test("animates the panel height and its items by default", async () => {
    await page.viewport(1280, 800);
    const animate = vi.spyOn(Element.prototype, "animate");
    await mount(<Sample panelLinks={8} />);

    await openDesktopPanel("Products");
    await vi.waitFor(() =>
      expect(query("[data-slot=navigation-menu-link]")).not.toBeNull(),
    );
    expect(
      getComputedStyle(query("[data-slot=navigation-menu-link]")!)
        .transitionDuration,
    ).toBe("0.24s");

    await openDesktopPanel("Services");
    await vi.waitFor(() => expect(animate).toHaveBeenCalled());
  });

  test("skips them with prefers-reduced-motion", async () => {
    await page.viewport(1280, 800);
    await commands.emulateReducedMotion("reduce");
    const animate = vi.spyOn(Element.prototype, "animate");
    await mount(<Sample panelLinks={8} />);

    await openDesktopPanel("Products");
    await vi.waitFor(() =>
      expect(query("[data-slot=navigation-menu-link]")).not.toBeNull(),
    );
    expect(
      getComputedStyle(query("[data-slot=navigation-menu-link]")!)
        .transitionProperty,
    ).toBe("none");

    await openDesktopPanel("Services");
    await vi.waitFor(() =>
      expect(
        [...document.querySelectorAll("[data-slot=navigation-menu-link]")]
          .length,
      ).toBe(4),
    );
    expect(animate).not.toHaveBeenCalled();
  });
});

describe("item stagger", () => {
  test("mobile adds groups and items up to a cap", async () => {
    await page.viewport(390, 700);
    await mount(<Sample panelLinks={12} sections={2} />);
    await userEvent.click(button("Menu"));
    await vi.waitFor(() =>
      expect(
        query("[data-slot=navigation-mobile-panel]")?.querySelectorAll(
          "[data-slot=navigation-menu-link]",
        ).length,
      ).toBe(24),
    );

    const links = [
      ...query("[data-slot=navigation-mobile-panel]")!.querySelectorAll(
        "[data-slot=navigation-menu-link]",
      ),
    ];
    const first = links.slice(0, 12).map(delayMs);
    const second = links.slice(12).map(delayMs);

    expect(first.slice(0, 3)).toEqual([200, 220, 240]);
    // Items past the eighth share a position, so a long list does not keep growing.
    expect(new Set(first.slice(7)).size).toBe(1);
    expect(second[0]).toBe(360);
    expect(Math.max(...first, ...second)).toBeLessThanOrEqual(200 + 20 * 12);
  });

  test("desktop animates all the sections together", async () => {
    await page.viewport(1280, 800);
    await mount(<Sample panelLinks={4} sections={3} />);
    await openDesktopPanel("Products");
    await vi.waitFor(() =>
      expect(
        document.querySelectorAll("[data-slot=navigation-menu-link]").length,
      ).toBe(12),
    );

    const sections = [
      ...document.querySelectorAll("[data-slot=navigation-section]"),
    ];
    const firsts = sections.map((section) =>
      delayMs(section.querySelector("[data-slot=navigation-menu-link]")!),
    );
    expect(firsts).toEqual([200, 200, 200]);
  });
});

describe("mobile panel", () => {
  test("scrolls on its own when the content is taller than the screen", async () => {
    await page.viewport(390, 500);
    await mount(<Sample panelLinks={20} sections={1} />);
    await userEvent.click(button("Menu"));

    const nav = await vi.waitFor(() => {
      const element = query<HTMLElement>("[data-slot=navigation-menu]");
      expect(element).not.toBeNull();
      expect(element!.scrollHeight).toBeGreaterThan(element!.clientHeight);
      return element!;
    });

    nav.scrollTop = 200;
    expect(nav.scrollTop).toBeGreaterThan(0);
    expect(window.scrollY).toBe(0);
    expect(document.documentElement.style.overflow).toBe("hidden");
  });

  test("keeps the bar in place when the page is already scrolled", async () => {
    await page.viewport(390, 700);
    await mount(<Sample />);
    window.scrollTo(0, 400);
    const bar = query("[data-slot=navigation]")!;
    await vi.waitFor(() => expect(bar.getBoundingClientRect().top).toBe(0));

    await userEvent.click(button("Menu"));
    const panel = await vi.waitFor(() => {
      const element = query("[data-slot=navigation-mobile-panel]");
      expect(element).not.toBeNull();
      return element!;
    });

    expect(bar.getBoundingClientRect().top).toBe(0);
    await vi.waitFor(() =>
      expect(
        Math.abs(
          panel.getBoundingClientRect().top -
            bar.getBoundingClientRect().bottom,
        ),
      ).toBeLessThanOrEqual(1),
    );
  });
});

describe("mobile back control", () => {
  test("does not linger next to the mark when the menu closes", async () => {
    await page.viewport(390, 700);
    await mount(
      <Navigation
        logoHref="#home"
        logoLabel="Home"
        searchLabel="Search"
        clearSearchLabel="Clear search"
        menuLabel="Menu"
        closeLabel="Close"
        backLabel="Back"
        menu={
          <NavigationSection>
            <NavigationMenuLink
              href="#products"
              submenu={
                <NavigationSection>
                  <Links count={2} />
                </NavigationSection>
              }
            >
              Products
            </NavigationMenuLink>
          </NavigationSection>
        }
      />,
    );

    await userEvent.click(button("Menu"));
    await userEvent.click(
      await vi.waitFor(() => {
        const element = link("Products");
        expect(element).toBeDefined();
        return element;
      }),
    );
    await vi.waitFor(() => expect(button("Back")).not.toBeNull());

    await userEvent.click(button("Close"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(button("Back")).toBeNull();
    expect(link("Home") ?? query('a[aria-label="Home"]')).not.toBeNull();
  });
});

describe("breakpoint", () => {
  test("releases the page scroll when it grows to desktop", async () => {
    await page.viewport(390, 700);
    await mount(<Sample />);
    await userEvent.click(button("Menu"));
    await vi.waitFor(() =>
      expect(document.documentElement.style.overflow).toBe("hidden"),
    );

    await page.viewport(1280, 800);
    await vi.waitFor(() =>
      expect(document.documentElement.style.overflow).not.toBe("hidden"),
    );
    expect(link("Products").getBoundingClientRect().width).toBeGreaterThan(0);
    expect(button("Close").getBoundingClientRect().width).toBe(0);

    await page.viewport(390, 700);
    await vi.waitFor(() =>
      expect(document.documentElement.style.overflow).toBe("hidden"),
    );
  });
});
