import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { BrandMark } from "./brand-mark";

const meta = {
  title: "Components/BrandMark",
  component: BrandMark,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BrandMark>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const ForwardsRef: Story = {
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<SVGSVGElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <BrandMark {...args} ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const mark = within(canvasElement).getByRole("img", { name: "my ai ds" });

    await expect(mark.tagName).toBe("svg");
    await expect(mark).toHaveAttribute("data-ref-tag", "svg");
    await expect(mark).toHaveAttribute("data-slot", "brand-mark");
  },
};
