import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Title } from "./title";

const meta = {
  title: "Components/Title",
  component: Title,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4"],
      description: "Heading level rendered in the DOM.",
    },
    children: {
      control: "text",
      description: "The title text.",
    },
  },
} satisfies Meta<typeof Title>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: "Title",
  },
};

export const HeadingLevel: Story = {
  args: {
    as: "h2",
    children: "Section title",
  },
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole("heading", {
      level: 2,
      name: "Section title",
    });

    await expect(heading).toHaveAttribute("data-slot", "title");
  },
};

export const ForwardsRef: Story = {
  args: {
    children: "Title",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLHeadingElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <Title {...args} ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole("heading", { name: "Title" });

    await expect(heading.tagName).toBe("H1");
    await expect(heading).toHaveAttribute("data-ref-tag", "H1");
  },
};
