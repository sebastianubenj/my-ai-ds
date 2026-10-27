import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { PageHeader } from "./page-header";

const meta = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
    titleAs: {
      control: "select",
      options: ["h1", "h2", "h3", "h4"],
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithDescription: Story = {
  args: {
    title: "Title",
    description: "Description.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
    await expect(canvas.getByText("Description.")).toBeInTheDocument();
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Title",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    await expect(canvas.queryByText("Description.")).not.toBeInTheDocument();
  },
};

export const ForwardsRef: Story = {
  args: {
    title: "Title",
    description: "Description.",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <PageHeader {...args} ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector("[data-slot='page-header']");

    await expect(root).toHaveAttribute("data-ref-tag", "DIV");
  },
};
