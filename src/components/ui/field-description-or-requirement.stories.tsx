import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { FieldDescriptionOrRequirement } from "./field-description-or-requirement";

const meta = {
  title: "Components/FieldDescriptionOrRequirement",
  component: FieldDescriptionOrRequirement,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Supporting copy for this line.",
    },
    state: {
      control: "select",
      options: ["pending", "met", "invalid"],
      description: "Visual and icon state of this supporting line.",
    },
    showIcon: {
      control: "boolean",
      description: "When false, only the copy is shown.",
    },
    icon: {
      control: "text",
      description: "Replaces the default icon for `state`.",
    },
  },
  args: {
    children: "At least 15 characters",
    state: "pending",
    showIcon: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FieldDescriptionOrRequirement>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Pending                                                                     */
/* -------------------------------------------------------------------------- */

export const Pending: Story = {};

/* -------------------------------------------------------------------------- */
/* Met                                                                         */
/* -------------------------------------------------------------------------- */

export const Met: Story = {
  args: {
    state: "met",
  },
};

/* -------------------------------------------------------------------------- */
/* Invalid                                                                     */
/* -------------------------------------------------------------------------- */

export const Invalid: Story = {
  args: {
    state: "invalid",
  },
};

/* -------------------------------------------------------------------------- */
/* Without icon                                                                */
/* -------------------------------------------------------------------------- */

export const WithoutIcon: Story = {
  args: {
    showIcon: false,
    children: "This is the field description",
  },
};

/* -------------------------------------------------------------------------- */
/* Custom icon                                                                 */
/* -------------------------------------------------------------------------- */

export const CustomIcon: Story = {
  args: {
    icon: "circle",
    children: "Not a commonly used or compromised password",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByText("Not a commonly used or compromised password");

    await expect(row).toHaveAttribute("data-state", "pending");
    await expect(row.querySelector("svg")).not.toBeNull();
  },
};

/* -------------------------------------------------------------------------- */
/* Requirement list                                                            */
/* -------------------------------------------------------------------------- */

export const RequirementList: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-(--primitives-spacing-1)">
      <FieldDescriptionOrRequirement state="met">
        At least 15 characters
      </FieldDescriptionOrRequirement>
      <FieldDescriptionOrRequirement state="pending">
        At least one number
      </FieldDescriptionOrRequirement>
      <FieldDescriptionOrRequirement state="invalid">
        At least one special character
      </FieldDescriptionOrRequirement>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/* States (behavior)                                                           */
/* -------------------------------------------------------------------------- */

export const States: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-(--primitives-spacing-1)">
      <FieldDescriptionOrRequirement state="pending">
        At least 15 characters
      </FieldDescriptionOrRequirement>
      <FieldDescriptionOrRequirement state="met">
        At least 15 characters
      </FieldDescriptionOrRequirement>
      <FieldDescriptionOrRequirement state="invalid">
        At least 15 characters
      </FieldDescriptionOrRequirement>
      <FieldDescriptionOrRequirement showIcon={false}>
        This is the field description
      </FieldDescriptionOrRequirement>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rows = canvas.getAllByText("At least 15 characters");

    await expect(rows).toHaveLength(3);
    await expect(rows[0]).toHaveAttribute("data-slot", "field-description-or-requirement");
    await expect(rows[0]).toHaveAttribute("data-state", "pending");
    await expect(rows[1]).toHaveAttribute("data-state", "met");
    await expect(rows[2]).toHaveAttribute("data-state", "invalid");

    const helper = canvas.getByText("This is the field description");
    await expect(helper).toHaveAttribute("data-state", "pending");
    await expect(helper.querySelector("svg")).toBeNull();
    await expect(rows[0].querySelector("svg")).not.toBeNull();
  },
};

/* -------------------------------------------------------------------------- */
/* Forwards ref                                                                */
/* -------------------------------------------------------------------------- */

export const ForwardsRef: Story = {
  render: function ForwardsRefRender() {
    const ref = React.useRef<HTMLParagraphElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return (
      <FieldDescriptionOrRequirement ref={ref}>
        At least 15 characters
      </FieldDescriptionOrRequirement>
    );
  },
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector(
      '[data-slot="field-description-or-requirement"]',
    );

    await expect(row).toBeInstanceOf(HTMLParagraphElement);
    await expect(row).toHaveAttribute("data-ref-tag", "P");
    await expect((row as HTMLParagraphElement).tagName).toBe("P");
  },
};
