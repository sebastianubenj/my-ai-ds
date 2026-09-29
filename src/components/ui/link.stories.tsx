import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Link } from "./link";

const meta = {
  title: "Components/Link",
  component: Link,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    href: {
      control: "text",
      description: "The URL the link navigates to.",
    },
    children: {
      control: "text",
      description: "The link's text content.",
    },
    destructive: {
      control: "boolean",
      description: "Destructive visual intent. Does not represent form validation.",
    },
    disabled: {
      control: "boolean",
      description: "Prevents navigation and interaction. Exposed as aria-disabled.",
    },
  },
  args: {
    href: "#",
    children: "Link",
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

const labelMdClassName = `font-sans [font-weight:var(--semantics-typography-label-font-weight)]
  text-(length:--semantics-typography-label-label-md-font-size)
  leading-(--semantics-typography-label-label-md-lh-snug)
  tracking-(--semantics-typography-label-label-md-tracking-0-125)
  [color:var(--semantics-colors-foreground-default)]`;

const buttonXlClassName = `font-sans [font-weight:var(--semantics-typography-button-font-weight)]
  text-(length:--semantics-typography-button-button-xl-font-size)
  leading-(--semantics-typography-button-button-xl-lh-snug)
  tracking-(--semantics-typography-button-tracking-normal)
  [color:var(--semantics-colors-foreground-default)]`;

/* -------------------------------------------------------------------------- */
/* Basic                                                                       */
/* -------------------------------------------------------------------------- */

export const Basic: Story = {
  render: (args) => (
    <p className={`m-0 ${labelMdClassName}`}>
      <Link {...args} />
    </p>
  ),
};

/* -------------------------------------------------------------------------- */
/* Inheritance                                                                 */
/* -------------------------------------------------------------------------- */

export const InheritsTypography: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-(--primitives-spacing-6)">
      <p className={`m-0 ${labelMdClassName}`}>
        Forgot password? <Link href="#">Reset it</Link>
      </p>
      <p className={`m-0 ${buttonXlClassName}`}>
        Don’t have an account? <Link href="#">Sign up</Link>
      </p>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/* Destructive                                                                 */
/* -------------------------------------------------------------------------- */

export const Destructive: Story = {
  args: {
    destructive: true,
    children: "Delete account",
  },
  render: (args) => (
    <p className={`m-0 ${labelMdClassName}`}>
      <Link {...args} />
    </p>
  ),
};

/* -------------------------------------------------------------------------- */
/* States                                                                      */
/* -------------------------------------------------------------------------- */

export const States: Story = {
  render: () => {
    const preventNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
    };

    return (
      <div className={`flex flex-wrap items-center gap-4 ${labelMdClassName}`}>
        <Link href="#default" onClick={preventNavigation}>
          Default
        </Link>
        <Link href="#hover" onClick={preventNavigation}>
          Hover
        </Link>
        <Link href="#pressed" onClick={preventNavigation}>
          Pressed
        </Link>
        <Link href="#focus" onClick={preventNavigation}>
          Focus
        </Link>
        <Link href="#disabled" disabled>
          Disabled
        </Link>
        <Link href="#destructive" destructive onClick={preventNavigation}>
          Destructive
        </Link>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const links = canvas.getAllByRole("link");

    const hoverLink = links[1];
    const pressedLink = links[2];
    const focusLink = links[3];
    const disabledLink = links[4];

    await userEvent.hover(hoverLink);

    await userEvent.pointer({
      keys: "[MouseLeft>]",
      target: pressedLink,
    });
    await userEvent.pointer({
      keys: "[/MouseLeft]",
      target: pressedLink,
    });

    await userEvent.click(focusLink);
    await expect(focusLink).toHaveFocus();

    await expect(disabledLink).toHaveAttribute("aria-disabled", "true");
    await expect(disabledLink).toHaveAttribute("tabindex", "-1");
  },
};

/* -------------------------------------------------------------------------- */
/* Ref                                                                         */
/* -------------------------------------------------------------------------- */

export const ForwardsRef: Story = {
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLAnchorElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return (
      <p className={`m-0 ${labelMdClassName}`}>
        <Link {...args} ref={ref} onClick={(event) => event.preventDefault()} />
      </p>
    );
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link");

    await expect(link.tagName).toBe("A");
    await expect(link).toHaveAttribute("data-ref-tag", "A");
    await expect(link).toHaveAttribute("data-slot", "link");
  },
};
