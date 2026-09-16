import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Input } from "./input";
import { Label } from "./label";

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
    id: "input-filled",
    defaultValue: "Hello world",
  },
  render: (args) => (
    <div className="flex w-full flex-col gap-(--primitives-spacing-2)">
      <Label htmlFor="input-filled">Example</Label>
      <Input {...args} className="w-80" />
    </div>
  ),
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
    id: "input-error-filled",
    error: true,
    defaultValue: "Invalid value",
  },
  render: (args) => (
    <div className="flex w-full flex-col gap-(--primitives-spacing-2)">
      <Label htmlFor="input-error-filled">Example</Label>
      <Input {...args} className="w-80" />
    </div>
  ),
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

/* -------------------------------------------------------------------------- */
/* Ref                                                                         */
/* -------------------------------------------------------------------------- */

export const ForwardsRef: Story = {
  args: {
    placeholder: "Placeholder text",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLInputElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <Input {...args} className="w-80" ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByPlaceholderText("Placeholder text");

    await expect(input.tagName).toBe("INPUT");
    await expect(input).toHaveAttribute("data-ref-tag", "INPUT");
  },
};
