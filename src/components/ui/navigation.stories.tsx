import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";

import {
  Navigation,
  NavigationIconButton,
  NavigationLink,
  NavigationMenuLink,
  NavigationSearchTrigger,
  NavigationSection,
} from "./navigation";

const sampleLinks = [
  "Products",
  "Services",
  "Discover",
  "Support",
  "About",
] as const;

type SampleLink = (typeof sampleLinks)[number];

const panels: Record<SampleLink, { sections: number; links: number }> = {
  Products: { sections: 3, links: 8 },
  Services: { sections: 2, links: 4 },
  Discover: { sections: 2, links: 6 },
  Support: { sections: 1, links: 5 },
  About: { sections: 1, links: 3 },
};

function stopNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function MenuLinks({ count = 8 }: { count?: number }) {
  return Array.from({ length: count }, (_, index) => (
    <NavigationMenuLink
      key={index}
      href={`#item-${index}`}
      onClick={stopNavigation}
    >
      Navigation menu link
    </NavigationMenuLink>
  ));
}

function SamplePanel({ sections, links }: { sections: number; links: number }) {
  return Array.from({ length: sections }, (_, index) => (
    <NavigationSection key={index} heading="Heading">
      <MenuLinks count={links} />
    </NavigationSection>
  ));
}

function SampleMenu() {
  return (
    <>
      <NavigationSection>
        {sampleLinks.map((label) => (
          <NavigationMenuLink
            key={label}
            href={`#${label.toLowerCase()}`}
            onClick={stopNavigation}
            submenu={<SamplePanel {...panels[label]} />}
          >
            {label}
          </NavigationMenuLink>
        ))}
      </NavigationSection>
    </>
  );
}

function SampleNavigation(
  props: Partial<React.ComponentProps<typeof Navigation>> & {
    navRef?: React.Ref<HTMLElement>;
  },
) {
  const { navRef, ...rest } = props;

  return (
    <Navigation
      ref={navRef}
      logoHref="#home"
      logoLabel="Home"
      searchLabel="Search"
      clearSearchLabel="Clear search"
      menuLabel="Menu"
      closeLabel="Close"
      backLabel="Back"
      {...rest}
    >
      {sampleLinks.map((label) => (
        <NavigationLink
          key={label}
          value={label.toLowerCase()}
          href={`#${label.toLowerCase()}`}
          onClick={stopNavigation}
          menu={<SamplePanel {...panels[label]} />}
          menuLabel={`${label} menu`}
        >
          {label}
        </NavigationLink>
      ))}
      <NavigationSearchTrigger />
      <NavigationIconButton name="shopping-bag" aria-label="Bag" />
    </Navigation>
  );
}

function ControlledNavigation({
  initialOpen = false,
  onBack,
}: {
  initialOpen?: boolean;
  onBack?: () => void;
}) {
  const [open, setOpen] = React.useState(initialOpen);

  return (
    <SampleNavigation
      open={open}
      onOpenChange={setOpen}
      menu={<SampleMenu />}
      onBack={onBack}
    />
  );
}

const meta = {
  title: "Components/Navigation",
  component: Navigation,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Navigation>;

export default meta;

type Story = StoryObj<typeof meta>;

const requiredArgs = {
  logoHref: "#home",
  logoLabel: "Home",
  searchLabel: "Search",
  clearSearchLabel: "Clear search",
  menuLabel: "Menu",
  closeLabel: "Close",
  backLabel: "Back",
};

export const Desktop: Story = {
  args: requiredArgs,
  render: () => <SampleNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const logo = canvas.getByRole("link", { name: "Home" });
    const search = canvas.getByRole("button", { name: "Search" });

    await expect(canvas.getByRole("link", { name: "Products" })).toBeVisible();
    await expect(search).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Bag" })).toBeVisible();
    await expect(logo).toHaveAttribute("href", "#home");

    const menu = canvasElement.querySelector("button[aria-label='Menu']");
    await expect(menu).not.toBeVisible();
  },
};

export const DesktopHover: Story = {
  args: requiredArgs,
  render: () => <SampleNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const panel = () => document.querySelector("[data-slot=navigation-panel]");
    const headings = () => body.getAllByRole("heading", { name: "Heading" });

    await expect(panel()).toBeNull();

    await userEvent.hover(canvas.getByRole("link", { name: "Products" }));
    await waitFor(() => expect(headings()).toHaveLength(3));
    await expect(
      body.getAllByRole("link", { name: "Navigation menu link" }),
    ).toHaveLength(24);

    await userEvent.hover(canvas.getByRole("link", { name: "Services" }));
    await waitFor(() => expect(headings()).toHaveLength(2));

    await userEvent.hover(canvas.getByRole("link", { name: "Support" }));
    await waitFor(() => expect(headings()).toHaveLength(1));

    await userEvent.hover(canvas.getByRole("link", { name: "About" }));
    await waitFor(() =>
      expect(
        body.getAllByRole("link", { name: "Navigation menu link" }),
      ).toHaveLength(3),
    );

    // The panel stays open after leaving a link, and closes after leaving the bar and the panel.
    await userEvent.unhover(canvas.getByRole("link", { name: "About" }));
    await waitFor(() => expect(panel()).toBeNull());
  },
};

export const DesktopKeyboard: Story = {
  args: requiredArgs,
  render: function DesktopKeyboardRender() {
    const [target, setTarget] = React.useState("none");

    return (
      <div data-target={target}>
        <Navigation
          logoHref="#home"
          logoLabel="Home"
          searchLabel="Search"
          clearSearchLabel="Clear search"
          menuLabel="Menu"
          closeLabel="Close"
          backLabel="Back"
        >
          <NavigationLink
            value="products"
            href="#products"
            onClick={(event) => {
              event.preventDefault();
              setTarget("products");
            }}
            menu={<SamplePanel sections={3} links={8} />}
            menuLabel="Products menu"
          >
            Products
          </NavigationLink>
          <NavigationLink
            value="services"
            href="#services"
            menu={<SamplePanel sections={2} links={4} />}
            menuLabel="Services menu"
          >
            Services
          </NavigationLink>
        </Navigation>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const panel = () => document.querySelector("[data-slot=navigation-panel]");
    const link = canvas.getByRole("link", { name: "Products" });
    const chevron = canvas.getByRole("button", { name: "Products menu" });

    // Enter on the link follows it and leaves the panel closed.
    link.focus();
    await userEvent.keyboard("{Enter}");
    await expect(
      canvasElement.querySelector("[data-target=products]"),
    ).toBeTruthy();
    await expect(panel()).toBeNull();
    await expect(chevron).toHaveAttribute("aria-expanded", "false");

    // Tab reaches the chevron, and Enter on it opens the panel.
    await userEvent.tab();
    await expect(chevron).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(body.getAllByRole("heading", { name: "Heading" })).toHaveLength(3),
    );
    await expect(chevron).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(panel()).toBeNull());
    await expect(chevron).toHaveAttribute("aria-expanded", "false");
  },
};

export const DesktopNavigates: Story = {
  args: requiredArgs,
  render: function DesktopNavigatesRender() {
    const [target, setTarget] = React.useState("none");

    return (
      <div data-target={target}>
        <Navigation
          logoHref="#home"
          logoLabel="Home"
          searchLabel="Search"
          clearSearchLabel="Clear search"
          menuLabel="Menu"
          closeLabel="Close"
          backLabel="Back"
        >
          <NavigationLink
            value="products"
            href="#products"
            onClick={(event) => {
              event.preventDefault();
              setTarget("products");
            }}
            menu={
              <NavigationSection heading="Heading">
                <NavigationMenuLink
                  href="#item"
                  onClick={(event) => {
                    event.preventDefault();
                    setTarget("item");
                  }}
                >
                  Navigation menu link
                </NavigationMenuLink>
              </NavigationSection>
            }
            menuLabel="Products menu"
          >
            Products
          </NavigationLink>
        </Navigation>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole("link", { name: "Products" }));
    await expect(
      canvasElement.querySelector("[data-target=products]"),
    ).toBeTruthy();

    await userEvent.hover(canvas.getByRole("link", { name: "Products" }));
    const item = await body.findByRole("link", {
      name: "Navigation menu link",
    });
    await userEvent.click(item);
    await expect(
      canvasElement.querySelector("[data-target=item]"),
    ).toBeTruthy();
    await waitFor(() =>
      expect(document.querySelector("[data-slot=navigation-panel]")).toBeNull(),
    );
  },
};

export const DesktopOpen: Story = {
  args: requiredArgs,
  render: () => (
    <SampleNavigation defaultValue="products" menu={<SampleMenu />} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await expect(
      canvas.getByRole("button", { name: "Products menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    await waitFor(() =>
      expect(body.getAllByRole("heading", { name: "Heading" })).toHaveLength(3),
    );
    await expect(
      body.getAllByRole("link", { name: "Navigation menu link" }),
    ).toHaveLength(24);
    await expect(
      document.querySelector("[data-slot=navigation-scrim]"),
    ).toBeVisible();

    const menu = canvasElement.querySelector("button[aria-label='Menu']");
    await expect(menu).not.toBeVisible();
  },
};

export const DesktopSearch: Story = {
  args: requiredArgs,
  render: () => <SampleNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const panel = () => document.querySelector("[data-slot=navigation-panel]");
    const search = canvas.getByRole("button", { name: "Search" });

    // Hover alone never opens the search panel.
    await userEvent.hover(search);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await expect(panel()).toBeNull();

    await userEvent.click(search);
    let field = await body.findByRole("searchbox", { name: "Search" });
    await expect(field).toHaveFocus();
    await expect(field).toHaveAttribute("placeholder", "Search");
    await expect(
      body.queryByRole("button", { name: "Clear search" }),
    ).toBeNull();

    // Hovering a link swaps the content of the open panel.
    await userEvent.hover(canvas.getByRole("link", { name: "Support" }));
    await waitFor(() =>
      expect(body.getAllByRole("heading", { name: "Heading" })).toHaveLength(1),
    );
    await userEvent.click(search);
    field = await body.findByRole("searchbox", { name: "Search" });
    await userEvent.click(field);

    await userEvent.type(field, "keyboard");
    await expect(field).toHaveValue("keyboard");
    await expect(body.getByRole("search")).toHaveAttribute(
      "data-state",
      "filled",
    );

    await userEvent.click(body.getByRole("button", { name: "Clear search" }));
    await expect(field).toHaveValue("");
    await expect(field).toHaveFocus();
    await expect(body.getByRole("search")).toHaveAttribute(
      "data-state",
      "default",
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(panel()).toBeNull());

    // Leaving the bar and the panel closes it.
    await userEvent.click(search);
    await body.findByRole("searchbox", { name: "Search" });
    await userEvent.unhover(search);
    await waitFor(() => expect(panel()).toBeNull());
  },
};

export const DesktopHoverCloses: Story = {
  args: requiredArgs,
  render: () => <SampleNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = () => document.querySelector("[data-slot=navigation-panel]");

    await userEvent.hover(canvas.getByRole("link", { name: "Products" }));
    await waitFor(() => expect(panel()).not.toBeNull());
    await userEvent.hover(canvas.getByRole("button", { name: "Search" }));
    await waitFor(() => expect(panel()).toBeNull());

    await userEvent.hover(canvas.getByRole("link", { name: "Services" }));
    await waitFor(() => expect(panel()).not.toBeNull());
    await userEvent.hover(canvas.getByRole("link", { name: "Home" }));
    await waitFor(() => expect(panel()).toBeNull());

    // Closing by pointer must not leave focus on a chevron.
    await expect(
      document.activeElement?.closest(
        "[data-slot=navigation-link-menu-trigger]",
      ),
    ).toBeNull();
    await userEvent.hover(canvas.getByRole("link", { name: "Products" }));
    await waitFor(() => expect(panel()).not.toBeNull());
    await userEvent.unhover(canvas.getByRole("link", { name: "Products" }));
    await waitFor(() => expect(panel()).toBeNull());
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(
      document.activeElement?.closest(
        "[data-slot=navigation-link-menu-trigger]",
      ),
    ).toBeNull();
  },
};

export const MobileSearch: Story = {
  args: requiredArgs,
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: () => <SampleNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Search" }));

    const field = await canvas.findByRole("searchbox", { name: "Search" });
    await waitFor(() => expect(field).toBeVisible());
    await expect(field).toHaveFocus();
    await expect(canvas.getByRole("button", { name: "Close" })).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "Menu" })).toBeNull();

    await userEvent.type(field, "ring");
    await expect(
      canvas.getByRole("button", { name: "Clear search" }),
    ).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(canvas.queryByRole("searchbox")).toBeNull());
    await expect(canvas.getByRole("button", { name: "Search" })).toHaveFocus();
  },
};

export const Mobile: Story = {
  args: requiredArgs,
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: () => <SampleNavigation menu={<SampleMenu />} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menu = canvas.getByRole("button", { name: "Menu" });

    await expect(menu).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Search" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Bag" })).toBeVisible();
    await expect(
      canvas.getByRole("link", { name: "Products", hidden: true }),
    ).not.toBeVisible();

    menu.focus();
    await expect(menu).toHaveFocus();
  },
};

export const MobileOpen: Story = {
  args: requiredArgs,
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: () => <ControlledNavigation initialOpen />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("button", { name: "Close" })).toBeVisible();
    await waitFor(() =>
      expect(canvas.getByRole("link", { name: "Products" })).toBeVisible(),
    );
  },
};

export const MobileToggle: Story = {
  args: requiredArgs,
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: () => <ControlledNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menu = canvas.getByRole("button", { name: "Menu" });

    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(menu);

    const close = canvas.getByRole("button", { name: "Close" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    await expect(close).toHaveFocus();
    await waitFor(() =>
      expect(canvas.getByRole("link", { name: "Products" })).toBeVisible(),
    );

    await userEvent.keyboard("{Escape}");

    await expect(canvas.getByRole("button", { name: "Menu" })).toHaveFocus();
    await waitFor(() =>
      expect(canvas.queryByRole("link", { name: "Products" })).toBeNull(),
    );
  },
};

export const MobileLevels: Story = {
  args: requiredArgs,
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: function MobileLevelsRender() {
    const [target, setTarget] = React.useState("none");

    return (
      <div data-target={target}>
        <SampleNavigation
          menu={
            <NavigationSection>
              <NavigationMenuLink
                href="#products"
                onClick={stopNavigation}
                submenu={
                  <NavigationSection heading="Heading">
                    <NavigationMenuLink
                      href="#item"
                      onClick={(event) => {
                        event.preventDefault();
                        setTarget("item");
                      }}
                    >
                      Navigation menu link
                    </NavigationMenuLink>
                  </NavigationSection>
                }
              >
                Products
              </NavigationMenuLink>
            </NavigationSection>
          }
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Menu" }));
    await expect(canvas.queryByRole("button", { name: "Back" })).toBeNull();

    await userEvent.click(canvas.getByRole("link", { name: "Products" }));
    const nested = await canvas.findByRole("link", {
      name: "Navigation menu link",
    });
    await waitFor(() => expect(nested).toBeVisible());
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Back" })).toHaveFocus(),
    );
    await expect(canvas.getByRole("button", { name: "Close" })).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    const root = await canvas.findByRole("link", { name: "Products" });
    await waitFor(() => expect(root).toBeVisible());
    await waitFor(() =>
      expect(canvas.queryByRole("button", { name: "Back" })).toBeNull(),
    );

    await userEvent.click(canvas.getByRole("link", { name: "Products" }));
    await userEvent.click(
      await canvas.findByRole("link", { name: "Navigation menu link" }),
    );
    await expect(
      canvasElement.querySelector("[data-target=item]"),
    ).toBeTruthy();

    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(
        canvas.queryByRole("link", { name: "Navigation menu link" }),
      ).toBeNull(),
    );
    await expect(canvas.getByRole("button", { name: "Menu" })).toHaveFocus();
  },
};

export const MobileBack: Story = {
  args: requiredArgs,
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: function MobileBackRender() {
    const [open, setOpen] = React.useState(false);
    const [backed, setBacked] = React.useState(false);

    return (
      <div data-backed={backed ? "true" : "false"}>
        <SampleNavigation
          open={open}
          onOpenChange={setOpen}
          menu={<SampleMenu />}
          onBack={() => setBacked(true)}
          backLabel="Back"
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Menu" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Back" })).toBeVisible(),
    );
    await expect(canvas.getByRole("button", { name: "Close" })).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    await expect(
      canvasElement.querySelector("[data-backed=true]"),
    ).toBeTruthy();
  },
};

export const DesktopSearchWidth: Story = {
  args: requiredArgs,
  render: () => <SampleNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole("button", { name: "Search" }));
    await body.findByRole("searchbox", { name: "Search" });

    // The field is as wide as the bar content, from the mark to the search button.
    const form = body.getByRole("search").getBoundingClientRect();
    const mark = canvas
      .getByRole("link", { name: "Home" })
      .getBoundingClientRect();
    const trigger = canvas
      .getByRole("button", { name: "Search" })
      .getBoundingClientRect();
    await expect(Math.abs(form.left - mark.left)).toBeLessThanOrEqual(1);
    await expect(Math.abs(form.right - trigger.right)).toBeLessThanOrEqual(1);
  },
};

export const DesktopTouch: Story = {
  args: requiredArgs,
  render: () => (
    <Navigation
      logoHref="#home"
      logoLabel="Home"
      searchLabel="Search"
      clearSearchLabel="Clear search"
      menuLabel="Menu"
      closeLabel="Close"
      backLabel="Back"
    >
      <NavigationLink
        href="#products"
        menu={<SamplePanel sections={1} links={2} />}
        menuLabel="Products menu"
      >
        Products
      </NavigationLink>
      <NavigationLink href="#about">About</NavigationLink>
    </Navigation>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const panel = () => document.querySelector("[data-slot=navigation-panel]");
    const products = canvas.getByRole("link", { name: "Products" });

    // Reports whether the component held back the link, before the story blocks navigation.
    let held = false;
    const record = (event: Event) => {
      held = event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener("click", record);
    const tap = (link: HTMLElement, pointerType: string) => {
      fireEvent.pointerDown(link, { pointerType });
      fireEvent.click(link);
      return held;
    };

    // Touch has no hover: the first tap opens the panel instead of following the link.
    await expect(tap(products, "touch")).toBe(true);
    await body.findByRole("heading", { name: "Heading" });

    // The second tap follows the link.
    await expect(tap(products, "touch")).toBe(false);

    // A link without a panel is never held back, and neither is a mouse click.
    await expect(
      tap(canvas.getByRole("link", { name: "About" }), "touch"),
    ).toBe(false);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(panel()).toBeNull());
    await expect(tap(products, "mouse")).toBe(false);

    document.removeEventListener("click", record);
  },
};

export const MobilePanel: Story = {
  args: requiredArgs,
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: () => <ControlledNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = document.documentElement;
    const bar = canvasElement.querySelector("[data-slot=navigation]")!;
    const menu = canvas.getByRole("button", { name: "Menu" });

    await expect(menu).not.toHaveAttribute("aria-controls");
    await userEvent.click(menu);

    // The button points at the panel it opens.
    const close = canvas.getByRole("button", { name: "Close" });
    const panelId = close.getAttribute("aria-controls");
    await expect(panelId).toBeTruthy();
    const panel = canvasElement.querySelector(`[id="${panelId}"]`)!;
    await expect(panel).toHaveAttribute("data-slot", "navigation-mobile-panel");

    // The page behind it does not scroll, and the panel starts where the bar ends.
    await expect(root.style.overflow).toBe("hidden");
    await waitFor(() =>
      expect(
        Math.abs(
          panel.getBoundingClientRect().top -
            bar.getBoundingClientRect().bottom,
        ),
      ).toBeLessThanOrEqual(1),
    );

    await userEvent.click(close);
    await waitFor(() =>
      expect(canvasElement.querySelector(`[id="${panelId}"]`)).toBeNull(),
    );
    await waitFor(() => expect(root.style.overflow).not.toBe("hidden"));
    await expect(menu).not.toHaveAttribute("aria-controls");
  },
};

export const ForwardsRef: Story = {
  args: requiredArgs,
  render: function ForwardsRefRender() {
    const ref = React.useRef<HTMLElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <SampleNavigation navRef={ref} />;
  },
  play: async ({ canvasElement }) => {
    const navigation = canvasElement.querySelector("[data-slot=navigation]");

    await expect(navigation).toHaveAttribute("data-ref-tag", "HEADER");
  },
};
