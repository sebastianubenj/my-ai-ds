import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "./button";
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
      options: ["text", "password", "email"],
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
    trailing: {
      control: false,
      description: "Interactive or custom content rendered after the value.",
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
/* Email                                                                       */
/* -------------------------------------------------------------------------- */

export const Email: Story = {
  args: {
    type: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("you@example.com");

    await expect(input).toHaveAttribute("type", "email");
    await expect(input).toHaveAttribute("autocomplete", "email");
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
/* Trailing slot                                                               */
/* -------------------------------------------------------------------------- */

export const WithTrailing: Story = {
  render: function WithTrailingRender() {
    const [value, setValue] = React.useState("");
    const [visible, setVisible] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    return (
      <form
        className="w-80"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <Input
          type={visible ? "text" : "password"}
          placeholder="Placeholder text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          trailing={
            value ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                icon={visible ? "eye-off" : "eye"}
                aria-label={visible ? "Hide password" : "Show password"}
                className="hover:[background-color:transparent] [&_svg]:![color:var(--semantics-colors-foreground-default)]"
                onClick={() => setVisible((value) => !value)}
              />
            ) : undefined
          }
        />
        {submitted ? <p>Form submitted</p> : null}
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Placeholder text");

    await expect(canvas.queryByRole("button", { name: "Show password" })).not.toBeInTheDocument();
    await expect(input).toHaveAttribute("type", "password");

    await userEvent.type(input, "a");
    const toggle = canvas.getByRole("button", { name: "Show password" });

    await expect(toggle).toBeInTheDocument();
    await expect(toggle).toHaveAttribute("type", "button");
    await expect(input).toHaveAttribute("type", "password");

    toggle.focus();
    await expect(toggle).toHaveFocus();

    await userEvent.click(toggle);
    await expect(input).toHaveAttribute("type", "text");
    await expect(canvas.getByRole("button", { name: "Hide password" })).toBeInTheDocument();
    await expect(canvas.queryByText("Form submitted")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Hide password" }));
    await expect(input).toHaveAttribute("type", "password");
    await expect(canvas.getByRole("button", { name: "Show password" })).toBeInTheDocument();
    await expect(canvas.queryByText("Form submitted")).not.toBeInTheDocument();
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
