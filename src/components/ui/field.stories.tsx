import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./checkbox";
import { CheckboxGroup } from "./checkbox-group";
import { Field } from "./field";
import { Input } from "./input";
import { RadioGroup } from "./radio-group";
import { RadioItem } from "./radio-item";
import {
  Select,
  SelectContent,
  SelectItem,
} from "./select";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/Field",
  component: Field,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: {
      control: "text",
      description: "Visible field name. Omit to hide the label row.",
    },
    optional: {
      control: "boolean",
      description: "Shows an “(optional)” marker next to the label.",
    },
    description: {
      control: "text",
      description: "Supporting helper or error copy.",
    },
    error: {
      control: "boolean",
      description: "Styles the description as an error. Does not set error on the child control.",
    },
    htmlFor: {
      control: "text",
      description: "Associates the label with a control. Match this to the control’s id.",
    },
    children: {
      control: false,
    },
  },
  args: {
    children: <Input placeholder="you@example.com" />,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Default                                                                     */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  args: {
    label: "Email",
    htmlFor: "field-default-email",
  },
  render: (args) => (
    <Field {...args}>
      <Input
        id={args.htmlFor}
        type="text"
        placeholder="you@example.com"
        aria-describedby={args.description ? `${args.htmlFor}-description` : undefined}
      />
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* Without label                                                               */
/* -------------------------------------------------------------------------- */

export const WithoutLabel: Story = {
  render: () => (
    <Field>
      <Input placeholder="Search" leadingIcon="search" aria-label="Search" />
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* Optional                                                                    */
/* -------------------------------------------------------------------------- */

export const Optional: Story = {
  args: {
    label: "Nickname",
    optional: true,
    htmlFor: "field-optional-nickname",
  },
  render: (args) => (
    <Field {...args}>
      <Input id={args.htmlFor} placeholder="How should we call you?" />
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* Description                                                                 */
/* -------------------------------------------------------------------------- */

export const Description: Story = {
  args: {
    label: "Email",
    htmlFor: "field-description-email",
    description: "We’ll never share your email with anyone else.",
  },
  render: (args) => (
    <Field {...args}>
      <Input
        id={args.htmlFor}
        type="text"
        placeholder="you@example.com"
        aria-describedby={`${args.htmlFor}-description`}
      />
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* Error                                                                       */
/* -------------------------------------------------------------------------- */

export const Error: Story = {
  args: {
    label: "Email",
    htmlFor: "field-error-email",
    description: "Please enter a valid email address.",
    error: true,
  },
  render: (args) => (
    <Field {...args}>
      <Input
        id={args.htmlFor}
        type="text"
        defaultValue="not-an-email"
        error
        aria-describedby={`${args.htmlFor}-description`}
      />
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* Input                                                                       */
/* -------------------------------------------------------------------------- */

export const WithInput: Story = {
  name: "Input",
  render: () => (
    <Field
      label="Email"
      htmlFor="field-input-email"
      description="Use the address you check most often."
    >
      <Input
        id="field-input-email"
        type="text"
        placeholder="you@example.com"
        aria-describedby="field-input-email-description"
      />
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* Textarea                                                                    */
/* -------------------------------------------------------------------------- */

export const WithTextarea: Story = {
  name: "Textarea",
  render: () => (
    <Field
      label="Bio"
      optional
      htmlFor="field-textarea-bio"
      description="A short introduction shown on your profile."
    >
      <Textarea
        id="field-textarea-bio"
        placeholder="Tell us a little about yourself"
        aria-describedby="field-textarea-bio-description"
      />
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* Select                                                                      */
/* -------------------------------------------------------------------------- */

export const WithSelect: Story = {
  name: "Select",
  render: () => (
    <Field
      label="Category"
      htmlFor="field-select-category"
      description="Choose the category that fits this item."
    >
      <Select
        id="field-select-category"
        placeholder="Select a category"
        aria-describedby="field-select-category-description"
      >
        <SelectContent>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="operations">Operations</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* CheckboxGroup                                                               */
/* -------------------------------------------------------------------------- */

export const WithCheckboxGroup: Story = {
  name: "CheckboxGroup",
  render: () => (
    <Field
      label="Notifications"
      description="Choose how you want to hear from us."
    >
      <CheckboxGroup>
        <Checkbox defaultChecked>Email</Checkbox>
        <Checkbox>SMS</Checkbox>
        <Checkbox>Push notifications</Checkbox>
      </CheckboxGroup>
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* RadioGroup                                                                  */
/* -------------------------------------------------------------------------- */

export const WithRadioGroup: Story = {
  name: "RadioGroup",
  render: () => (
    <Field label="Plan" description="You can change this later.">
      <RadioGroup>
        <RadioItem name="field-plan" value="basic" defaultChecked>
          Basic
        </RadioItem>
        <RadioItem name="field-plan" value="pro">
          Pro
        </RadioItem>
        <RadioItem name="field-plan" value="team">
          Team
        </RadioItem>
      </RadioGroup>
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* Composition                                                                 */
/* -------------------------------------------------------------------------- */

export const Composition: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-(--primitives-spacing-6)">
      <Field
        label="Full name"
        htmlFor="field-composition-name"
      >
        <Input
          id="field-composition-name"
          placeholder="Jane Doe"
        />
      </Field>
      <Field
        label="Email"
        htmlFor="field-composition-email"
        description="We’ll send a confirmation to this address."
      >
        <Input
          id="field-composition-email"
          type="text"
          placeholder="you@example.com"
          aria-describedby="field-composition-email-description"
        />
      </Field>
      <Field
        label="Role"
        htmlFor="field-composition-role"
      >
        <Select id="field-composition-role" placeholder="Select a role">
          <SelectContent>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="engineer">Engineer</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field
        label="About"
        optional
        htmlFor="field-composition-about"
      >
        <Textarea
          id="field-composition-about"
          placeholder="Anything else we should know?"
        />
      </Field>
    </div>
  ),
};
