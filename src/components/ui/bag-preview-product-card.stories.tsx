import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { BagPreviewProductCard } from "./bag-preview-product-card";

const productPhoto = "/product-card-tp7.png";

function Frame({
  width,
  children,
}: {
  width: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="max-w-full p-(--primitives-spacing-4) [background-color:var(--semantics-colors-background-primary)] [color:var(--semantics-colors-foreground-primary)]"
      style={{ width }}
    >
      {children}
    </div>
  );
}

const meta = {
  title: "Components/BagPreviewProductCard",
  component: BagPreviewProductCard,
  parameters: {
    layout: "padded",
  },
  args: {
    name: "TP-7 aluminum",
    src: productPhoto,
    alt: "Teenage Engineering TP-7 aluminum field recorder",
    quantity: "x2",
  },
  argTypes: {
    device: {
      control: "select",
      options: ["desktop", "mobile"],
      description: "Thumb size and name-to-quantity gap.",
    },
    name: {
      control: "text",
      description: "Product name shown next to the photo.",
    },
    src: {
      control: false,
      description: "Product photo URL.",
    },
    alt: {
      control: "text",
      description: "Accessible description of the product photo.",
    },
    showQuantity: {
      control: "boolean",
      description: "Shows the quantity line under the name.",
    },
    quantity: {
      control: "text",
      description: "Quantity line. Visible when showQuantity is true.",
    },
  },
} satisfies Meta<typeof BagPreviewProductCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    device: "desktop",
  },
  render: (args) => (
    <Frame width={672}>
      <BagPreviewProductCard {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("article");
    const photo = canvas.getByRole("img", {
      name: "Teenage Engineering TP-7 aluminum field recorder",
    });

    await expect(card).toHaveAttribute("data-slot", "bag-preview-product-card");
    await expect(photo).toBeInTheDocument();
    await expect(
      canvas.queryByText("x2"),
    ).not.toBeInTheDocument();
  },
};

export const Mobile: Story = {
  args: {
    device: "mobile",
  },
  render: (args) => (
    <Frame width={326}>
      <BagPreviewProductCard {...args} />
    </Frame>
  ),
};

export const WithQuantity: Story = {
  args: {
    device: "desktop",
    showQuantity: true,
  },
  render: (args) => (
    <Frame width={672}>
      <BagPreviewProductCard {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("x2")).toBeVisible();
  },
};

export const ForwardsRef: Story = {
  args: {
    device: "desktop",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return (
      <Frame width={672}>
        <BagPreviewProductCard {...args} ref={ref} />
      </Frame>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("article");

    await expect(card.tagName).toBe("ARTICLE");
    await expect(card).toHaveAttribute("data-ref-tag", "ARTICLE");
    await expect(card).toHaveAttribute(
      "data-slot",
      "bag-preview-product-card",
    );
  },
};
