import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  TypographySpecimen,
  type TypographySpecimenProps,
} from "./typography-specimen";

const PANGRAM = "The quick brown fox jumps over the lazy dog.";
const FAMILY = "Inter";

const sharedFamily = "[font-family:var(--semantics-typography-font-family)]";

function stack(specimens: TypographySpecimenProps[]) {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-8)">
      {specimens.map((specimen) => (
        <TypographySpecimen key={specimen.name} {...specimen} />
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Display: Story = {
  render: () =>
    stack([
      {
        name: "Display / Large",
        sample: PANGRAM,
        token: "semantics.typography.display.display-lg",
        family: FAMILY,
        weight: "600",
        size: "3.75rem",
        lineHeight: "1.1",
        letterSpacing: "-0.00833em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-display-font-weight)]
          text-(length:--semantics-typography-display-display-lg-font-size)
          leading-(--semantics-typography-display-display-lg-lh-tighter)
          tracking-(--semantics-typography-display-display-lg-tracking-tight)`,
      },
      {
        name: "Display / Medium",
        sample: PANGRAM,
        token: "semantics.typography.display.display-md",
        family: FAMILY,
        weight: "600",
        size: "3rem",
        lineHeight: "1.1",
        letterSpacing: "-0.00937em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-display-font-weight)]
          text-(length:--semantics-typography-display-display-md-font-size)
          leading-(--semantics-typography-display-display-md-lh-tighter)
          tracking-(--semantics-typography-display-display-md-tracking-tight)`,
      },
      {
        name: "Display / Small",
        sample: PANGRAM,
        token: "semantics.typography.display.display-sm",
        family: FAMILY,
        weight: "600",
        size: "2.25rem",
        lineHeight: "1.1",
        letterSpacing: "-0.01111em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-display-font-weight)]
          text-(length:--semantics-typography-display-display-sm-font-size)
          leading-(--semantics-typography-display-display-sm-lh-tighter)
          tracking-(--semantics-typography-display-display-sm-tracking-tight)`,
      },
    ]),
};

export const Heading: Story = {
  render: () =>
    stack([
      {
        name: "Heading / XL",
        sample: PANGRAM,
        token: "semantics.typography.heading.heading-xl",
        family: FAMILY,
        weight: "600",
        size: "1.5rem",
        lineHeight: "1.25",
        letterSpacing: "-0.025em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-heading-font-weight)]
          text-(length:--semantics-typography-heading-heading-xl-font-size)
          leading-(--semantics-typography-heading-heading-xl-lh-tight)
          tracking-(--semantics-typography-heading-heading-xl-tracking-tight)`,
      },
      {
        name: "Heading / Large",
        sample: PANGRAM,
        token: "semantics.typography.heading.heading-lg",
        family: FAMILY,
        weight: "600",
        size: "1.25rem",
        lineHeight: "1.25",
        letterSpacing: "-0.025em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-heading-font-weight)]
          text-(length:--semantics-typography-heading-heading-lg-font-size)
          leading-(--semantics-typography-heading-heading-lg-lh-tight)
          tracking-(--semantics-typography-heading-heading-lg-tracking-tight)`,
      },
      {
        name: "Heading / Medium",
        sample: PANGRAM,
        token: "semantics.typography.heading.heading-md",
        family: FAMILY,
        weight: "600",
        size: "1.125rem",
        lineHeight: "1.25",
        letterSpacing: "-0.025em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-heading-font-weight)]
          text-(length:--semantics-typography-heading-heading-md-font-size)
          leading-(--semantics-typography-heading-heading-md-lh-tight)
          tracking-(--semantics-typography-heading-heading-md-tracking-tight)`,
      },
      {
        name: "Heading / Small",
        sample: PANGRAM,
        token: "semantics.typography.heading.heading-sm",
        family: FAMILY,
        weight: "600",
        size: "1rem",
        lineHeight: "1.25",
        letterSpacing: "-0.025em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-heading-font-weight)]
          text-(length:--semantics-typography-heading-heading-sm-font-size)
          leading-(--semantics-typography-heading-heading-sm-lh-tight)
          tracking-(--semantics-typography-heading-heading-sm-tracking-tight)`,
      },
    ]),
};

export const Body: Story = {
  render: () =>
    stack([
      {
        name: "Body / Large",
        sample: PANGRAM,
        token: "semantics.typography.body.body-lg",
        family: FAMILY,
        weight: "400",
        size: "1rem",
        lineHeight: "1.5",
        letterSpacing: "-0.025em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-body-font-weight)]
          text-(length:--semantics-typography-body-body-lg-font-size)
          leading-(--semantics-typography-body-body-lg-lh-normal)
          tracking-(--semantics-typography-body-body-lg-tracking-tight)`,
      },
      {
        name: "Body / Medium",
        sample: PANGRAM,
        token: "semantics.typography.body.body-md",
        family: FAMILY,
        weight: "400",
        size: "0.875rem",
        lineHeight: "1.5",
        letterSpacing: "-0.025em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-body-font-weight)]
          text-(length:--semantics-typography-body-body-md-font-size)
          leading-(--semantics-typography-body-body-md-lh-normal)
          tracking-(--semantics-typography-body-body-md-tracking-tight)`,
      },
      {
        name: "Body / Small",
        sample: PANGRAM,
        token: "semantics.typography.body.body-sm",
        family: FAMILY,
        weight: "400",
        size: "0.75rem",
        lineHeight: "1.5",
        letterSpacing: "-0.025em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-body-font-weight)]
          text-(length:--semantics-typography-body-body-sm-font-size)
          leading-(--semantics-typography-body-body-sm-lh-normal)
          tracking-(--semantics-typography-body-body-sm-tracking-tight)`,
      },
    ]),
};

export const Label: Story = {
  render: () =>
    stack([
      {
        name: "Label / XL",
        sample: "Email address",
        token: "semantics.typography.label.label-xl",
        family: FAMILY,
        weight: "500",
        size: "1.125rem",
        lineHeight: "1.375",
        letterSpacing: "-0.01222em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-label-font-weight)]
          text-(length:--semantics-typography-label-label-xl-font-size)
          leading-(--semantics-typography-label-label-xl-lh-snug)
          tracking-(--semantics-typography-label-label-xl-tracking-0-125)`,
      },
      {
        name: "Label / Large",
        sample: "Email address",
        token: "semantics.typography.label.label-lg",
        family: FAMILY,
        weight: "500",
        size: "1rem",
        lineHeight: "1.375",
        letterSpacing: "-0.0125em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-label-font-weight)]
          text-(length:--semantics-typography-label-label-lg-font-size)
          leading-(--semantics-typography-label-label-lg-lh-snug)
          tracking-(--semantics-typography-label-label-lg-tracking-0-125)`,
      },
      {
        name: "Label / Medium",
        sample: "Email address",
        token: "semantics.typography.label.label-md",
        family: FAMILY,
        weight: "500",
        size: "0.875rem",
        lineHeight: "1.375",
        letterSpacing: "-0.01214em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-label-font-weight)]
          text-(length:--semantics-typography-label-label-md-font-size)
          leading-(--semantics-typography-label-label-md-lh-snug)
          tracking-(--semantics-typography-label-label-md-tracking-0-125)`,
      },
      {
        name: "Label / Small",
        sample: "Email address",
        token: "semantics.typography.label.label-sm",
        family: FAMILY,
        weight: "500",
        size: "0.75rem",
        lineHeight: "1.375",
        letterSpacing: "-0.0125em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-label-font-weight)]
          text-(length:--semantics-typography-label-label-sm-font-size)
          leading-(--semantics-typography-label-label-sm-lh-snug)
          tracking-(--semantics-typography-label-label-sm-tracking-0-125)`,
      },
    ]),
};

export const Button: Story = {
  render: () =>
    stack([
      {
        name: "Button / XL",
        sample: "Continue",
        token: "semantics.typography.button.button-xl",
        family: FAMILY,
        weight: "500",
        size: "1.125rem",
        lineHeight: "1.375",
        letterSpacing: "0em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-button-font-weight)]
          text-(length:--semantics-typography-button-button-xl-font-size)
          leading-(--semantics-typography-button-button-xl-lh-snug)
          tracking-(--semantics-typography-button-tracking-normal)`,
      },
      {
        name: "Button / Large",
        sample: "Continue",
        token: "semantics.typography.button.button-lg",
        family: FAMILY,
        weight: "500",
        size: "1rem",
        lineHeight: "1.375",
        letterSpacing: "0em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-button-font-weight)]
          text-(length:--semantics-typography-button-button-lg-font-size)
          leading-(--semantics-typography-button-button-lg-lh-snug)
          tracking-(--semantics-typography-button-tracking-normal)`,
      },
      {
        name: "Button / Medium",
        sample: "Continue",
        token: "semantics.typography.button.button-md",
        family: FAMILY,
        weight: "500",
        size: "0.875rem",
        lineHeight: "1.375",
        letterSpacing: "0em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-button-font-weight)]
          text-(length:--semantics-typography-button-button-md-font-size)
          leading-(--semantics-typography-button-button-md-lh-snug)
          tracking-(--semantics-typography-button-tracking-normal)`,
      },
      {
        name: "Button / Small",
        sample: "Continue",
        token: "semantics.typography.button.button-sm",
        family: FAMILY,
        weight: "500",
        size: "0.75rem",
        lineHeight: "1.375",
        letterSpacing: "0em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-button-font-weight)]
          text-(length:--semantics-typography-button-button-sm-font-size)
          leading-(--semantics-typography-button-button-sm-lh-snug)
          tracking-(--semantics-typography-button-tracking-normal)`,
      },
    ]),
};

export const Caption: Story = {
  render: () =>
    stack([
      {
        name: "Caption",
        sample: PANGRAM,
        token: "semantics.typography.caption",
        family: FAMILY,
        weight: "400",
        size: "0.625rem",
        lineHeight: "1.375",
        letterSpacing: "0em",
        className: `${sharedFamily} [font-weight:var(--semantics-typography-caption-font-weight)]
          text-(length:--semantics-typography-caption-font-size)
          leading-(--semantics-typography-caption-lh-snug)
          tracking-(--semantics-typography-caption-tracking-normal)`,
      },
    ]),
};
