import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { RadioToggle } from "./radio-toggle";

const meta = {
  title: "Components/RadioToggle",
  component: RadioToggle,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controlled checked state.",
    },
    invalid: {
      control: "boolean",
      description: "Marks the control as invalid. Mirrored to aria-invalid.",
    },
    disabled: {
      control: "boolean",
      description: "Prevents interaction with the radio.",
    },
    "aria-label": {
      control: "text",
      description: "Accessible name. Required when no visible label is present.",
    },
  },
  args: {
    "aria-label": "Option",
  },
} satisfies Meta<typeof RadioToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Interactive                                                                 */
/* -------------------------------------------------------------------------- */

export const Interactive: Story = {
  render: () => (
    <div className="flex items-center gap-(--primitives-spacing-4)">
      <RadioToggle name="interactive" value="a" defaultChecked aria-label="Option A" />
      <RadioToggle name="interactive" value="b" aria-label="Option B" />
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/* Unchecked                                                                   */
/* -------------------------------------------------------------------------- */

export const Unchecked: Story = {
  args: {
    defaultChecked: false,
  },
};

export const UncheckedInvalid: Story = {
  args: {
    defaultChecked: false,
    invalid: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio");

    await expect(radio).toHaveAttribute("aria-invalid", "true");
  },
};

/* -------------------------------------------------------------------------- */
/* Checked                                                                     */
/* -------------------------------------------------------------------------- */

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const CheckedInvalid: Story = {
  args: {
    defaultChecked: true,
    invalid: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                    */
/* -------------------------------------------------------------------------- */

export const DisabledUnchecked: Story = {
  args: {
    defaultChecked: false,
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio");

    await expect(radio).toBeDisabled();
  },
};

export const DisabledChecked: Story = {
  args: {
    defaultChecked: true,
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
    const radio = canvas.getByRole("radio");

    await userEvent.tab();
    await expect(radio).toHaveFocus();
  },
};

/* -------------------------------------------------------------------------- */
/* Ref                                                                         */
/* -------------------------------------------------------------------------- */

export const ForwardsRef: Story = {
  args: {
    "aria-label": "Option",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLInputElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <RadioToggle {...args} ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const radio = within(canvasElement).getByRole("radio");

    await expect(radio.tagName).toBe("INPUT");
    await expect(radio).toHaveAttribute("data-ref-tag", "INPUT");
  },
};
