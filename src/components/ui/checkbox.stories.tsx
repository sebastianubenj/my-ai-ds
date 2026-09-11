import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Checkbox } from "./checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "card"],
      description: "Controls the layout appearance of the checkbox.",
    },
    checked: {
      control: "boolean",
      description: "Controlled checked state. Independent of `indeterminate`.",
    },
    indeterminate: {
      control: "boolean",
      description: "Native indeterminate state. Passed through to CheckboxToggle.",
    },
    invalid: {
      control: "boolean",
      description: "Marks the checkbox as invalid. Mirrored to aria-invalid.",
    },
    disabled: {
      control: "boolean",
      description: "Prevents interaction with the checkbox.",
    },
    children: {
      control: "text",
      description: "Visible label. Provides the accessible name.",
    },
    description: {
      control: "text",
      description: "Optional supporting text associated via aria-describedby.",
    },
  },
  args: {
    children: "Label",
    description: "Description",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Interactive                                                                 */
/* -------------------------------------------------------------------------- */

export const Interactive: Story = {
  args: {
    defaultChecked: false,
  },
};

/* -------------------------------------------------------------------------- */
/* Default                                                                     */
/* -------------------------------------------------------------------------- */

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Default invalid                                                             */
/* -------------------------------------------------------------------------- */

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

export const CheckedInvalid: Story = {
  args: {
    checked: true,
    invalid: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Default disabled                                                            */
/* -------------------------------------------------------------------------- */

export const UncheckedDisabled: Story = {
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

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Card                                                                        */
/* -------------------------------------------------------------------------- */

export const CardUnchecked: Story = {
  args: {
    variant: "card",
    checked: false,
  },
};

export const CardChecked: Story = {
  args: {
    variant: "card",
    checked: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Card invalid                                                                */
/* -------------------------------------------------------------------------- */

export const CardUncheckedInvalid: Story = {
  args: {
    variant: "card",
    checked: false,
    invalid: true,
  },
};

export const CardCheckedInvalid: Story = {
  args: {
    variant: "card",
    checked: true,
    invalid: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Card disabled                                                               */
/* -------------------------------------------------------------------------- */

export const CardUncheckedDisabled: Story = {
  args: {
    variant: "card",
    checked: false,
    disabled: true,
  },
};

export const CardCheckedDisabled: Story = {
  args: {
    variant: "card",
    checked: true,
    disabled: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

export const WithDescription: Story = {
  args: {
    children: "Label",
    description: "Description",
  },
};

export const LabelOnly: Story = {
  args: {
    children: "Label",
    description: "",
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
