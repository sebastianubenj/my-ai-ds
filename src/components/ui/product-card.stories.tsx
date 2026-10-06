import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { ProductCard } from "./product-card";

const productPhoto = "/product-card-tp7.png";

const meta = {
  title: "Components/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "padded",
  },
  args: {
    name: "TP-7 aluminum",
    price: "$1499",
    src: productPhoto,
    alt: "Teenage Engineering TP-7 aluminum field recorder",
    actionLabel: "Add",
  },
  argTypes: {
    layout: {
      control: "select",
      options: ["horizontal", "vertical", "square"],
      description: "Controls the photo well aspect and how the image sits in it.",
    },
    name: {
      control: "text",
      description: "Product name shown under the photo.",
    },
    price: {
      control: "text",
      description: "Price shown under the product name.",
    },
    src: {
      control: false,
      description: "Product photo URL.",
    },
    alt: {
      control: "text",
      description: "Accessible description of the product photo.",
    },
    actionLabel: {
      control: "text",
      description: "Label of the primary action button.",
    },
    showAction: {
      control: "boolean",
      description: "When false, the primary button is not rendered.",
    },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    layout: "horizontal",
  },
  render: (args) => (
    <div className="max-w-full" style={{ width: 644 }}>
      <ProductCard {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const add = canvas.getByRole("button", { name: "Add" });

    await expect(add).toHaveAttribute("type", "button");
    await userEvent.click(add);
  },
};

export const Vertical: Story = {
  args: {
    layout: "vertical",
  },
  render: (args) => (
    <div className="max-w-full" style={{ width: 310 }}>
      <ProductCard {...args} />
    </div>
  ),
};

export const Square: Story = {
  args: {
    layout: "square",
  },
  render: (args) => (
    <div className="max-w-full" style={{ width: 342 }}>
      <ProductCard {...args} />
    </div>
  ),
};

export const WithoutAction: Story = {
  args: {
    layout: "horizontal",
    price: "sold out",
    showAction: false,
  },
  render: (args) => (
    <div className="max-w-full" style={{ width: 644 }}>
      <ProductCard {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("article")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "Add" })).toBeNull();
  },
};

export const ForwardsRef: Story = {
  args: {
    layout: "square",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return (
      <div className="max-w-full" style={{ width: 342 }}>
        <ProductCard {...args} ref={ref} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("article");

    await expect(card.tagName).toBe("ARTICLE");
    await expect(card).toHaveAttribute("data-ref-tag", "ARTICLE");
    await expect(card).toHaveAttribute("data-slot", "product-card");
  },
};
