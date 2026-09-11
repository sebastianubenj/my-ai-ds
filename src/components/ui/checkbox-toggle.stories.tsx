import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { CheckboxToggle } from "./checkbox-toggle";

const meta = {
  title: "Components/CheckboxToggle",
  component: CheckboxToggle,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controlled checked state. Independent of `indeterminate`.",
    },
    indeterminate: {
      control: "boolean",
      description: "Native indeterminate state. Applied via the DOM property.",
    },
    invalid: {
      control: "boolean",
      description: "Marks the control as invalid. Mirrored to aria-invalid.",
    },
    disabled: {
      control: "boolean",
      description: "Prevents interaction with the checkbox.",
    },
    "aria-label": {
      control: "text",
      description: "Accessible name. Required when no visible label is present.",
    },
  },
  args: {
    "aria-label": "Toggle",
  },
} satisfies Meta<typeof CheckboxToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Interactive                                                                 */
/* -------------------------------------------------------------------------- */

export const Interactive: Story = {
  args: {
    defaultChecked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();

    checkbox.focus();
    await userEvent.keyboard(" ");
    await expect(checkbox).toBeChecked();

    await userEvent.keyboard(" ");
    await expect(checkbox).not.toBeChecked();
  },
};

/* -------------------------------------------------------------------------- */
/* Unchecked                                                                   */
/* -------------------------------------------------------------------------- */

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};

export const UncheckedInvalid: Story = {
  args: {
    checked: false,
    invalid: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await expect(checkbox).toHaveAttribute("aria-invalid", "true");
  },
};

/* -------------------------------------------------------------------------- */
/* Indeterminate                                                               */
/* -------------------------------------------------------------------------- */

export const Indeterminate: Story = {
  args: {
    checked: false,
    indeterminate: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await expect(checkbox).toHaveProperty("indeterminate", true);
  },
};

export const IndeterminateInvalid: Story = {
  args: {
    checked: false,
    indeterminate: true,
    invalid: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Checked                                                                     */
/* -------------------------------------------------------------------------- */

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const CheckedInvalid: Story = {
  args: {
    checked: true,
    invalid: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                    */
/* -------------------------------------------------------------------------- */

export const DisabledUnchecked: Story = {
  args: {
    checked: false,
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await expect(checkbox).toBeDisabled();
  },
};

export const DisabledIndeterminate: Story = {
  args: {
    checked: false,
    indeterminate: true,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Focus Visible                                                               */
/* -------------------------------------------------------------------------- */

export const KeyboardFocus: Story = {
  name: "Focus Visible",
  args: {
    defaultChecked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
  },
};
