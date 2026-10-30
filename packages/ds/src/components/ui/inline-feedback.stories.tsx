import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { InlineFeedback } from "./inline-feedback";

const meta = {
  title: "Components/InlineFeedback",
  component: InlineFeedback,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Title",
    description: "Description.",
    showIcon: true,
  },
  argTypes: {
    type: {
      control: "select",
      options: ["info", "invalid", "success"],
      description: "Visual tone of the callout.",
    },
    title: {
      control: "text",
      description: "Primary line. Omit to hide.",
    },
    description: {
      control: "text",
      description: "Supporting line. Omit to hide.",
    },
    showIcon: {
      control: "boolean",
      description: "Shows the type icon.",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-(--primitives-max-width-max-w-sm)">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InlineFeedback>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    type: "info",
  },
};

export const Invalid: Story = {
  args: {
    type: "invalid",
  },
};

export const Success: Story = {
  args: {
    type: "success",
  },
};

export const TitleOnly: Story = {
  args: {
    type: "info",
    description: undefined,
  },
};

export const DescriptionOnly: Story = {
  args: {
    type: "info",
    title: undefined,
  },
};

export const WithoutIcon: Story = {
  args: {
    type: "info",
    showIcon: false,
  },
};

export const ForwardsRef: Story = {
  args: {
    type: "invalid",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <InlineFeedback {...args} ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const feedback = canvas.getByRole("alert");

    await expect(feedback.tagName).toBe("DIV");
    await expect(feedback).toHaveAttribute("data-slot", "inline-feedback");
    await expect(feedback).toHaveAttribute("data-type", "invalid");
    await expect(feedback).toHaveAttribute("data-ref-tag", "DIV");
  },
};

export const StatusRole: Story = {
  args: {
    type: "info",
  },
  play: async ({ canvasElement }) => {
    const feedback = within(canvasElement).getByRole("status");

    await expect(feedback).toHaveAttribute("data-slot", "inline-feedback");
    await expect(feedback).toHaveAttribute("data-type", "info");
  },
};
