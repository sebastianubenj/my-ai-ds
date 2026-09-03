import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Input } from "./input";

const iconOptions = ["arrow-left", "arrow-right", "activity", "search"] as const;

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password"],
      description: "Native input type.",
    },
    error: {
      control: "boolean",
      description: "Marks the input as invalid. Mirrored to aria-invalid.",
    },
    leadingIcon: {
      control: "select",
      options: iconOptions,
      description: "Decorative icon displayed before the value/placeholder.",
    },
    trailingIcon: {
      control: "select",
      options: iconOptions,
      description: "Decorative icon displayed after the value/placeholder.",
    },
    placeholder: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
  },
  render: (args) => <Input {...args} className="w-80" />,
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                     */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  args: {
    placeholder: "Placeholder text",
  },
};

/* -------------------------------------------------------------------------- */
/* Password                                                                    */
/* -------------------------------------------------------------------------- */

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Placeholder text",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Placeholder text");

    await expect(input).toHaveAttribute("type", "password");
  },
};

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */

export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: "search",
    placeholder: "Search",
  },
};

export const WithTrailingIcon: Story = {
  args: {
    trailingIcon: "arrow-right",
    placeholder: "Placeholder text",
  },
};

export const WithLeadingAndTrailingIcon: Story = {
  args: {
    leadingIcon: "search",
    trailingIcon: "arrow-right",
    placeholder: "Placeholder text",
  },
};

/* -------------------------------------------------------------------------- */
/* Filled (native value)                                                      */
/* -------------------------------------------------------------------------- */

export const Filled: Story = {
  args: {
    defaultValue: "Hello world",
  },
};

/* -------------------------------------------------------------------------- */
/* Error                                                                       */
/* -------------------------------------------------------------------------- */

export const ErrorState: Story = {
  name: "Error",
  args: {
    error: true,
    placeholder: "Placeholder text",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Placeholder text");

    await expect(input).toHaveAttribute("aria-invalid", "true");
  },
};

export const ErrorFilled: Story = {
  args: {
    error: true,
    defaultValue: "Invalid value",
  },
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                    */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Placeholder text",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Placeholder text");

    await expect(input).toBeDisabled();
  },
};

/* -------------------------------------------------------------------------- */
/* Interaction                                                                 */
/* -------------------------------------------------------------------------- */

export const TypingUpdatesValue: Story = {
  args: {
    placeholder: "Type here",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Type here");

    await userEvent.type(input, "Hello");
    await expect(input).toHaveValue("Hello");

    await userEvent.tab();
  },
};
