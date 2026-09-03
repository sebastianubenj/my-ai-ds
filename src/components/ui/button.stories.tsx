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
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    const hoverButton = buttons[1];
    const pressedButton = buttons[2];
    const focusButton = buttons[3];
    const disabledButton = buttons[4];

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
