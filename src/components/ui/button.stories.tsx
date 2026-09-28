import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "./button";

const iconOptions = ["arrow-left", "arrow-right", "activity", "search"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "destructive", "outline", "ghost"],
      description: "Controls the visual style of the button.",
    },
    size: {
      control: "select",
      options: [
        "lg",
        "md",
        "sm",
        "xs",
        "icon-lg",
        "icon-md",
        "icon-sm",
        "icon-xs",
      ],
      description: "Controls the size of the button.",
    },
    leadingIcon: {
      control: "select",
      options: iconOptions,
      description: "Icon displayed before the button label.",
    },
    trailingIcon: {
      control: "select",
      options: iconOptions,
      description: "Icon displayed after the button label.",
    },
    icon: {
      control: "select",
      options: iconOptions,
      description: "Icon displayed when using an icon-only size.",
    },
    disabled: {
      control: "boolean",
      description: "Prevents interaction with the button.",
    },
    loading: {
      control: "boolean",
      description:
      "Shows a leading loader indicator and prevents interaction while preserving the default loading appearance.",
    },
    "aria-label": {
      control: "text",
      description: "Accessible name for the button, required for icon-only buttons.",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Variants                                                                    */
/* -------------------------------------------------------------------------- */

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    children: "Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    size: "md",
    children: "Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    size: "md",
    children: "Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "md",
    children: "Button",
  },
};

/* -------------------------------------------------------------------------- */
/* Sizes                                                                       */
/* -------------------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="lg">Large</Button>
      <Button size="md">Medium</Button>
      <Button size="sm">Small</Button>
      <Button size="xs">Extra Small</Button>

      <Button
        size="icon-lg"
        icon="arrow-left"
        aria-label="Go back"
      />
      <Button
        size="icon-md"
        icon="arrow-left"
        aria-label="Go back"
      />
      <Button
        size="icon-sm"
        icon="arrow-left"
        aria-label="Go back"
      />
      <Button
        size="icon-xs"
        icon="arrow-left"
        aria-label="Go back"
      />
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/* States                                                                      */
/* -------------------------------------------------------------------------- */

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button>Default</Button>
      <Button>Hover</Button>
      <Button>Pressed</Button>
      <Button>Focus</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    const hoverButton = buttons[1];
    const pressedButton = buttons[2];
    const focusButton = buttons[3];
    const disabledButton = buttons[4];
    const loadingButton = buttons[5];

    // Hover
    await userEvent.hover(hoverButton);

    // Pressed
    await userEvent.pointer({
      keys: "[MouseLeft>]",
      target: pressedButton,
    });

    await userEvent.pointer({
      keys: "[/MouseLeft]",
      target: pressedButton,
    });

    // Focus
    await userEvent.click(focusButton);
    await expect(focusButton).toHaveFocus();

    // Disabled
    await expect(disabledButton).toBeDisabled();

    // Loading is a state/property, not a variant
    await expect(loadingButton).toHaveTextContent("Loading");
    await expect(loadingButton).toBeDisabled();
    await expect(loadingButton).toHaveAttribute("aria-busy", "true");
    await expect(loadingButton).toHaveAttribute("data-loading", "true");
    await expect(loadingButton.querySelector("svg.animate-spin")).toBeTruthy();
    await expect(getComputedStyle(loadingButton).opacity).toBe("1");
  },
};

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */

export const WithLeadingIcon: Story = {
  args: {
    variant: "primary",
    size: "md",
    leadingIcon: "arrow-left",
    children: "Button",
  },
};

export const WithTrailingIcon: Story = {
  args: {
    variant: "primary",
    size: "md",
    trailingIcon: "arrow-right",
    children: "Button",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "primary",
    size: "icon-md",
    icon: "arrow-left",
    "aria-label": "Go back",
  },
};

/* -------------------------------------------------------------------------- */
/* Loading                                                                     */
/* -------------------------------------------------------------------------- */

async function expectLoadingButton(
  button: HTMLElement,
  { name, dataLoading = true }: { name: string; dataLoading?: boolean },
) {
  await expect(button).toHaveAccessibleName(name);
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute("aria-busy", "true");
  await expect(button.querySelector("svg.animate-spin")).toBeTruthy();
  await expect(getComputedStyle(button).pointerEvents).toBe("none");

  if (dataLoading) {
    await expect(button).toHaveAttribute("data-loading", "true");
    await expect(getComputedStyle(button).opacity).toBe("1");
  } else {
    await expect(button).not.toHaveAttribute("data-loading");
  }
}

export const PrimaryLoading: Story = {
  args: {
    variant: "primary",
    size: "md",
    loading: true,
    leadingIcon: "arrow-left",
    children: "Log in",
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Log in" });
    const svgs = button.querySelectorAll("svg");

    await expectLoadingButton(button, { name: "Log in" });
    await expect(button).toHaveTextContent("Log in");
    await expect(svgs).toHaveLength(1);
    await expect(svgs[0]).toHaveClass("animate-spin");
  },
};

export const GhostLoading: Story = {
  args: {
    variant: "ghost",
    size: "md",
    loading: true,
    children: "Log in",
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Log in" });

    await expectLoadingButton(button, { name: "Log in" });
    await expect(button).toHaveTextContent("Log in");
  },
};

export const IconOnlyLoading: Story = {
  args: {
    variant: "primary",
    size: "icon-md",
    icon: "arrow-left",
    loading: true,
    "aria-label": "Go back",
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Go back" });
    const svgs = button.querySelectorAll("svg");

    await expectLoadingButton(button, { name: "Go back" });
    await expect(svgs).toHaveLength(1);
    await expect(svgs[0]).toHaveClass("animate-spin");
  },
};

export const LoadingSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="lg" loading>
        Log in
      </Button>
      <Button size="md" loading>
        Log in
      </Button>
      <Button size="sm" loading>
        Log in
      </Button>
      <Button size="xs" loading>
        Log in
      </Button>
      <Button
        size="icon-lg"
        icon="arrow-left"
        loading
        aria-label="Go back"
      />
      <Button
        size="icon-md"
        icon="arrow-left"
        loading
        aria-label="Go back"
      />
      <Button
        size="icon-sm"
        icon="arrow-left"
        loading
        aria-label="Go back"
      />
      <Button
        size="icon-xs"
        icon="arrow-left"
        loading
        aria-label="Go back"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const labeled = canvas.getAllByRole("button", { name: "Log in" });
    const iconOnly = canvas.getAllByRole("button", { name: "Go back" });

    await expect(labeled).toHaveLength(4);
    await expect(iconOnly).toHaveLength(4);

    for (const button of [...labeled, ...iconOnly]) {
      await expectLoadingButton(button, {
        name: button.getAttribute("aria-label") ?? "Log in",
      });
    }
  },
};

export const LoadingAndDisabled: Story = {
  args: {
    variant: "primary",
    size: "md",
    loading: true,
    disabled: true,
    children: "Log in",
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Log in" });

    await expectLoadingButton(button, { name: "Log in", dataLoading: false });
    await expect(button).toHaveTextContent("Log in");
    await expect(Number.parseFloat(getComputedStyle(button).opacity)).toBeLessThan(1);
  },
};

/* -------------------------------------------------------------------------- */
/* Ref                                                                         */
/* -------------------------------------------------------------------------- */

export const ForwardsRef: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Button",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLButtonElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <Button {...args} ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Button" });

    await expect(button.tagName).toBe("BUTTON");
    await expect(button).toHaveAttribute("data-ref-tag", "BUTTON");
  },
};
