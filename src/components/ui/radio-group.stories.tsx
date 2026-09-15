import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { RadioGroup } from "./radio-group";
import { RadioItem } from "./radio-item";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: {
      control: false,
      description: "RadioItem components rendered inside the group.",
    },
    className: {
      control: "text",
      description: "Adds custom CSS classes to the group root.",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Interactive                                                                 */
/* -------------------------------------------------------------------------- */

export const Interactive: Story = {
  render: () => (
    <RadioGroup>
      <RadioItem name="interactive" value="one" defaultChecked>
        Option one
      </RadioItem>
      <RadioItem name="interactive" value="two">
        Option two
      </RadioItem>
      <RadioItem name="interactive" value="three">
        Option three
      </RadioItem>
    </RadioGroup>
  ),
};

/* -------------------------------------------------------------------------- */
/* Figma snapshots                                                             */
/* -------------------------------------------------------------------------- */

export const Unchecked: Story = {
  render: () => (
    <RadioGroup>
      <RadioItem name="unchecked" value="one" checked={false}>
        Label
      </RadioItem>
      <RadioItem name="unchecked" value="two" checked={false}>
        Label
      </RadioItem>
      <RadioItem name="unchecked" value="three" checked={false}>
        Label
      </RadioItem>
      <RadioItem name="unchecked" value="four" checked={false}>
        Label
      </RadioItem>
    </RadioGroup>
  ),
};

/* -------------------------------------------------------------------------- */
/* Composition                                                                 */
/* -------------------------------------------------------------------------- */

export const Composition: Story = {
  render: () => (
    <RadioGroup>
      <RadioItem name="composition" value="one">
        Label
      </RadioItem>
      <RadioItem name="composition" value="two" description="Description">
        Label
      </RadioItem>
      <RadioItem name="composition" value="three" defaultChecked>
        Label
      </RadioItem>
    </RadioGroup>
  ),
};

/* -------------------------------------------------------------------------- */
/* RadioItem states inside the group                                           */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <RadioGroup>
      <RadioItem name="disabled" value="one" checked={false} disabled>
        Label
      </RadioItem>
      <RadioItem name="disabled" value="two" checked={false} disabled>
        Label
      </RadioItem>
      <RadioItem name="disabled" value="three" checked={false} disabled>
        Label
      </RadioItem>
      <RadioItem name="disabled" value="four" checked={false} disabled>
        Label
      </RadioItem>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole("radio");

    await expect(radios).toHaveLength(4);
    await expect(radios[0]).toBeDisabled();
    await expect(radios[1]).toBeDisabled();
    await expect(radios[2]).toBeDisabled();
    await expect(radios[3]).toBeDisabled();
  },
};

export const Invalid: Story = {
  render: () => (
    <RadioGroup>
      <RadioItem name="invalid" value="one" checked={false} invalid>
        Label
      </RadioItem>
      <RadioItem name="invalid" value="two" checked={false} invalid>
        Label
      </RadioItem>
      <RadioItem name="invalid" value="three" checked={false} invalid>
        Label
      </RadioItem>
      <RadioItem name="invalid" value="four" checked={false} invalid>
        Label
      </RadioItem>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole("radio");

    await expect(radios).toHaveLength(4);
    await expect(radios[0]).toHaveAttribute("aria-invalid", "true");
    await expect(radios[1]).toHaveAttribute("aria-invalid", "true");
    await expect(radios[2]).toHaveAttribute("aria-invalid", "true");
    await expect(radios[3]).toHaveAttribute("aria-invalid", "true");
  },
};

export const MutualExclusivity: Story = {
  render: () => (
    <RadioGroup>
      <RadioItem name="exclusivity" value="one" defaultChecked>
        Option one
      </RadioItem>
      <RadioItem name="exclusivity" value="two">
        Option two
      </RadioItem>
      <RadioItem name="exclusivity" value="three">
        Option three
      </RadioItem>
    </RadioGroup>
  ),
};

/* -------------------------------------------------------------------------- */
/* Ref                                                                         */
/* -------------------------------------------------------------------------- */

export const ForwardsRef: Story = {
  render: function ForwardsRefRender() {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <RadioGroup ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="radio-group"]');

    await expect(group).toBeInstanceOf(HTMLDivElement);
    await expect(group).toHaveAttribute("data-ref-tag", "DIV");
    await expect((group as HTMLDivElement).tagName).toBe("DIV");
  },
};
