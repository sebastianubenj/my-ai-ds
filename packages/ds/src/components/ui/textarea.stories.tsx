import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Textarea } from "./textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    error: {
      control: "boolean",
      description: "Marks the textarea as invalid. Mirrored to aria-invalid.",
    },
    disabled: {
      control: "boolean",
      description: "Prevents interaction with the textarea.",
    },
    placeholder: {
      control: "text",
    },
  },
  args: {
    placeholder: "Placeholder text",
  },
  render: (args) => <Textarea {...args} className="w-80" />,
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Interactive                                                                 */
/* -------------------------------------------------------------------------- */

export const Interactive: Story = {};

/* -------------------------------------------------------------------------- */
/* Default                                                                     */
/* -------------------------------------------------------------------------- */

export const Default: Story = {};

/* -------------------------------------------------------------------------- */
/* Filled (native value)                                                      */
/* -------------------------------------------------------------------------- */

export const Filled: Story = {
  args: {
    defaultValue: "Placeholder text",
  },
};

/* -------------------------------------------------------------------------- */
/* Error                                                                       */
/* -------------------------------------------------------------------------- */

export const ErrorState: Story = {
  name: "Error",
  args: {
    error: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText("Placeholder text");

    await expect(textarea).toHaveAttribute("aria-invalid", "true");
  },
};

export const FilledError: Story = {
  args: {
    error: true,
    defaultValue: "Placeholder text",
  },
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                    */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText("Placeholder text");

    await expect(textarea).toBeDisabled();
  },
};

/* -------------------------------------------------------------------------- */
/* Focus                                                                       */
/* -------------------------------------------------------------------------- */

export const Focus: Story = {};

/* -------------------------------------------------------------------------- */
/* Focus Visible                                                               */
/* -------------------------------------------------------------------------- */

export const KeyboardFocus: Story = {
  name: "Focus Visible",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText("Placeholder text");

    await userEvent.tab();
    await expect(textarea).toHaveFocus();
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
    const ref = React.useRef<HTMLTextAreaElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <Textarea {...args} className="w-80" ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByPlaceholderText("Placeholder text");

    await expect(textarea.tagName).toBe("TEXTAREA");
    await expect(textarea).toHaveAttribute("data-ref-tag", "TEXTAREA");
  },
};
