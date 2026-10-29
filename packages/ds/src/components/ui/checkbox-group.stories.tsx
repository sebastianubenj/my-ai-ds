import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Checkbox } from "./checkbox";
import { CheckboxGroup } from "./checkbox-group";

const meta = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: {
      control: false,
      description: "Checkbox components rendered inside the group.",
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
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Interactive                                                                 */
/* -------------------------------------------------------------------------- */

export const Interactive: Story = {
  render: () => (
    <CheckboxGroup>
      <Checkbox defaultChecked={false}>Option one</Checkbox>
      <Checkbox defaultChecked={false}>Option two</Checkbox>
      <Checkbox defaultChecked={false}>Option three</Checkbox>
    </CheckboxGroup>
  ),
};

/* -------------------------------------------------------------------------- */
/* Figma snapshots                                                             */
/* -------------------------------------------------------------------------- */

export const Unchecked: Story = {
  render: () => (
    <CheckboxGroup>
      <Checkbox checked={false}>Label</Checkbox>
      <Checkbox checked={false}>Label</Checkbox>
      <Checkbox checked={false}>Label</Checkbox>
      <Checkbox checked={false}>Label</Checkbox>
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <CheckboxGroup>
      <Checkbox checked={false} disabled>
        Label
      </Checkbox>
      <Checkbox checked={false} disabled>
        Label
      </Checkbox>
      <Checkbox checked={false} disabled>
        Label
      </Checkbox>
      <Checkbox checked={false} disabled>
        Label
      </Checkbox>
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    await expect(checkboxes).toHaveLength(4);
    await expect(checkboxes[0]).toBeDisabled();
    await expect(checkboxes[1]).toBeDisabled();
    await expect(checkboxes[2]).toBeDisabled();
    await expect(checkboxes[3]).toBeDisabled();
  },
};

export const Invalid: Story = {
  render: () => (
    <CheckboxGroup>
      <Checkbox checked={false} invalid>
        Label
      </Checkbox>
      <Checkbox checked={false} invalid>
        Label
      </Checkbox>
      <Checkbox checked={false} invalid>
        Label
      </Checkbox>
      <Checkbox checked={false} invalid>
        Label
      </Checkbox>
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    await expect(checkboxes).toHaveLength(4);
    await expect(checkboxes[0]).toHaveAttribute("aria-invalid", "true");
    await expect(checkboxes[1]).toHaveAttribute("aria-invalid", "true");
    await expect(checkboxes[2]).toHaveAttribute("aria-invalid", "true");
    await expect(checkboxes[3]).toHaveAttribute("aria-invalid", "true");
  },
};

/* -------------------------------------------------------------------------- */
/* Composition                                                                 */
/* -------------------------------------------------------------------------- */

export const Composition: Story = {
  render: () => (
    <CheckboxGroup>
      <Checkbox>Label</Checkbox>
      <Checkbox description="Description">Label</Checkbox>
      <Checkbox defaultChecked>Label</Checkbox>
    </CheckboxGroup>
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

    return <CheckboxGroup ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="checkbox-group"]');

    await expect(group).toBeInstanceOf(HTMLDivElement);
    await expect(group).toHaveAttribute("data-ref-tag", "DIV");
    await expect((group as HTMLDivElement).tagName).toBe("DIV");
  },
};
