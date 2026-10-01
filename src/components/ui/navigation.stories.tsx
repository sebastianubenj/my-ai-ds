import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Navigation, NavigationLink, NavigationMenuLink, NavigationSection } from "./navigation";

const sampleLinks = ["Products", "Services", "Discover", "Support", "About"] as const;

function stopNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function MenuLinks() {
  return Array.from({ length: 8 }, (_, index) => (
    <NavigationMenuLink key={index} href={`#item-${index}`} onClick={stopNavigation}>
      Navigation menu link
    </NavigationMenuLink>
  ));
}

function SampleMenu() {
  return (
    <>
      <NavigationSection
        heading="Heading"
        className="max-md:[&>[data-slot=navigation-section-heading]]:hidden"
      >
        {MenuLinks()}
      </NavigationSection>
      <NavigationSection heading="Heading">{MenuLinks()}</NavigationSection>
      <NavigationSection heading="Heading">{MenuLinks()}</NavigationSection>
    </>
  );
}

function SampleNavigation(
  props: Partial<React.ComponentProps<typeof Navigation>> & { navRef?: React.Ref<HTMLElement> },
) {
  const { navRef, ...rest } = props;

  return (
    <Navigation
      ref={navRef}
      logoHref="#home"
      logoLabel="Home"
      searchLabel="Search"
      menuLabel="Menu"
      closeLabel="Close"
      {...rest}
    >
      {sampleLinks.map((label) => (
        <NavigationLink key={label} href={`#${label.toLowerCase()}`} onClick={stopNavigation}>
          {label}
        </NavigationLink>
      ))}
    </Navigation>
  );
}

function ControlledNavigation({
  initialOpen = false,
  onBack,
  backLabel,
}: {
  initialOpen?: boolean;
  onBack?: () => void;
  backLabel?: string;
}) {
  const [open, setOpen] = React.useState(initialOpen);

  return (
    <SampleNavigation
      open={open}
      onOpenChange={setOpen}
      menu={<SampleMenu />}
      onBack={onBack}
      backLabel={backLabel}
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
  menuLabel: "Menu",
  closeLabel: "Close",
};

export const Desktop: Story = {
  args: requiredArgs,
  render: () => <SampleNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const logo = canvas.getByRole("link", { name: "Home" });
    const products = canvas.getByRole("link", { name: "Products" });
    const search = canvas.getByRole("button", { name: "Search" });

    await expect(products).toBeVisible();
    await expect(search).toBeVisible();

    logo.focus();
    await userEvent.tab();
    await expect(products).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Services" })).toHaveFocus();

    const menu = canvasElement.querySelector("button[aria-label='Menu']");
    await expect(menu).not.toBeVisible();
  },
};

export const DesktopOpen: Story = {
  args: requiredArgs,
  render: () => <ControlledNavigation initialOpen />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("link", { name: "Products" })).toBeVisible();
    await expect(canvas.getAllByRole("heading", { name: "Heading" })).toHaveLength(3);
    await expect(canvas.getAllByRole("link", { name: "Navigation menu link" }).length).toBe(24);
    await expect(canvasElement.querySelector("[data-slot=navigation-scrim]")).toBeVisible();

    const menu = canvasElement.querySelector("button[aria-label='Menu']");
    await expect(menu).not.toBeVisible();
  },
};

export const Mobile: Story = {
  args: requiredArgs,
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: () => <SampleNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menu = canvas.getByRole("button", { name: "Menu" });

    await expect(menu).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Search" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Products", hidden: true })).not.toBeVisible();

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
    await expect(canvas.getAllByRole("heading", { name: "Heading" })).toHaveLength(2);
    await expect(canvas.getAllByRole("link", { name: "Navigation menu link" })[0]).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Products", hidden: true })).not.toBeVisible();
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

    await userEvent.click(menu);

    const close = canvas.getByRole("button", { name: "Close" });
    await expect(close).toHaveFocus();
    await expect(canvas.getAllByRole("heading", { name: "Heading" })).toHaveLength(2);
    await expect(canvas.getAllByRole("link", { name: "Navigation menu link" })[0]).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Products", hidden: true })).not.toBeVisible();

    await userEvent.keyboard("{Escape}");

    await expect(canvas.getByRole("button", { name: "Menu" })).toHaveFocus();
    await expect(canvas.queryAllByRole("link", { name: "Navigation menu link" })).toHaveLength(0);
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
    await expect(canvas.getByRole("button", { name: "Back" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Close" })).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    await expect(canvasElement.querySelector("[data-backed=true]")).toBeTruthy();
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
