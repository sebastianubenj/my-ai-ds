import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "./select";

const iconOptions = ["arrow-left", "arrow-right", "activity", "search"] as const;

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
  { value: "kiwi", label: "Kiwi" },
] as const;

function fruitItems() {
  return fruits.map((fruit) => (
    <SelectItem key={fruit.value} value={fruit.value}>
      {fruit.label}
    </SelectItem>
  ));
}

const openPopupDecorator: Meta<typeof Select>["decorators"] = [
  (Story) => (
    <div className="min-h-80">
      <Story />
    </div>
  ),
];

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder shown when no value is selected.",
    },
    error: {
      control: "boolean",
      description: "Marks the select as invalid. Mirrored to aria-invalid.",
    },
    disabled: {
      control: "boolean",
      description: "Prevents interaction with the select.",
    },
    leadingIcon: {
      control: "select",
      options: iconOptions,
      description: "Decorative icon displayed before the value/placeholder.",
    },
    required: {
      control: "boolean",
    },
  },
  args: {
    placeholder: "Placeholder text",
    "aria-label": "Fruit",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Select {...args}>
      <SelectContent>{fruitItems()}</SelectContent>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

async function getTrigger(canvasElement: HTMLElement) {
  return within(canvasElement).getByRole("combobox");
}

async function getListbox() {
  return within(document.body).findByRole("listbox");
}

/* -------------------------------------------------------------------------- */
/* Interactive                                                                 */
/* -------------------------------------------------------------------------- */

export const Interactive: Story = {};

/* -------------------------------------------------------------------------- */
/* Default                                                                     */
/* -------------------------------------------------------------------------- */

export const Default: Story = {};

/* -------------------------------------------------------------------------- */
/* Filled                                                                      */
/* -------------------------------------------------------------------------- */

export const Filled: Story = {
  args: {
    defaultValue: "banana",
  },
};

/* -------------------------------------------------------------------------- */
/* Leading icon                                                                */
/* -------------------------------------------------------------------------- */

export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: "search",
    placeholder: "Search",
  },
};

/* -------------------------------------------------------------------------- */
/* Error                                                                       */
/* -------------------------------------------------------------------------- */

export const ErrorState: Story = {
  name: "Error",
  args: {
    error: true,
  },
  play: async ({ canvasElement }) => {
    const trigger = await getTrigger(canvasElement);

    await expect(trigger).toHaveAttribute("aria-invalid", "true");
  },
};

export const FilledError: Story = {
  args: {
    error: true,
    defaultValue: "banana",
  },
};

/* -------------------------------------------------------------------------- */
/* Disabled                                                                    */
/* -------------------------------------------------------------------------- */

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const trigger = await getTrigger(canvasElement);

    await expect(trigger).toBeDisabled();
  },
};

/* -------------------------------------------------------------------------- */
/* Disabled item                                                               */
/* -------------------------------------------------------------------------- */

export const DisabledItem: Story = {
  args: {
    defaultOpen: true,
  },
  decorators: openPopupDecorator,
  render: (args) => (
    <Select {...args}>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana" disabled>
          Banana
        </SelectItem>
        <SelectItem value="mango">Mango</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/* -------------------------------------------------------------------------- */
/* Destructive item                                                            */
/* -------------------------------------------------------------------------- */

export const DestructiveItem: Story = {
  args: {
    defaultOpen: true,
  },
  decorators: openPopupDecorator,
  render: (args) => (
    <Select {...args}>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="delete" destructive>
          Delete
        </SelectItem>
        <SelectItem value="mango">Mango</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/* -------------------------------------------------------------------------- */
/* Highlighted item                                                            */
/* -------------------------------------------------------------------------- */

export const HighlightedItem: Story = {
  args: {
    defaultOpen: true,
  },
  decorators: openPopupDecorator,
  play: async () => {
    const listbox = await getListbox();
    const option = within(listbox).getByRole("option", { name: "Banana" });

    await userEvent.hover(option);
    await expect(option).toHaveAttribute("data-highlighted");
  },
};

/* -------------------------------------------------------------------------- */
/* Selected item                                                               */
/* -------------------------------------------------------------------------- */

export const SelectedItem: Story = {
  args: {
    defaultValue: "banana",
    defaultOpen: true,
  },
  decorators: openPopupDecorator,
  play: async () => {
    const listbox = await getListbox();
    const option = within(listbox).getByRole("option", { name: "Banana" });

    await expect(option).toHaveAttribute("data-selected");
  },
};

/* -------------------------------------------------------------------------- */
/* Group + SelectLabel                                                         */
/* -------------------------------------------------------------------------- */

export const WithGroups: Story = {
  args: {
    placeholder: "Select a fruit",
    defaultOpen: true,
  },
  decorators: openPopupDecorator,
  render: (args) => (
    <Select {...args}>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Citrus</SelectLabel>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="lemon">Lemon</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Tropical</SelectLabel>
          <SelectItem value="mango">Mango</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/* -------------------------------------------------------------------------- */
/* Long list / scrolling                                                       */
/* -------------------------------------------------------------------------- */

export const LongList: Story = {
  args: {
    placeholder: "Select an option",
    defaultOpen: true,
  },
  decorators: openPopupDecorator,
  render: (args) => (
    <Select {...args}>
      <SelectContent>
        {Array.from({ length: 24 }, (_, index) => {
          const value = `option-${index + 1}`;
          return (
            <SelectItem key={value} value={value}>
              Option {index + 1}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  ),
};

/* -------------------------------------------------------------------------- */
/* Focus                                                                       */
/* -------------------------------------------------------------------------- */

export const Focus: Story = {};

/* -------------------------------------------------------------------------- */
/* Focus Visible                                                               */
/* -------------------------------------------------------------------------- */

export const KeyboardFocus: Story = {
  name: "Focus Visible",
  play: async ({ canvasElement }) => {
    const trigger = await getTrigger(canvasElement);

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
  },
};

/* -------------------------------------------------------------------------- */
/* Controlled value                                                            */
/* -------------------------------------------------------------------------- */

export const ControlledValue: Story = {
  render: function ControlledValueStory(args) {
    const [value, setValue] = React.useState<string | null>("banana");

    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <SelectContent>{fruitItems()}</SelectContent>
      </Select>
    );
  },
  play: async ({ canvasElement }) => {
    const trigger = await getTrigger(canvasElement);

    await expect(trigger).toHaveTextContent("Banana");

    await userEvent.click(trigger);
    const listbox = await getListbox();
    await userEvent.click(within(listbox).getByRole("option", { name: "Mango" }));

    await expect(trigger).toHaveTextContent("Mango");
  },
};

/* -------------------------------------------------------------------------- */
/* Controlled open                                                             */
/* -------------------------------------------------------------------------- */

export const ControlledOpen: Story = {
  decorators: openPopupDecorator,
  render: function ControlledOpenStory(args) {
    const [open, setOpen] = React.useState(true);

    return (
      <div className="flex flex-col gap-(--primitives-spacing-3)">
        <button
          type="button"
          className="self-start underline"
          onClick={() => setOpen((current) => !current)}
        >
          Toggle open
        </button>
        <Select {...args} open={open} onOpenChange={setOpen}>
          <SelectContent>{fruitItems()}</SelectContent>
        </Select>
      </div>
    );
  },
  play: async () => {
    const listbox = await getListbox();

    await expect(listbox).toBeVisible();
  },
};

/* -------------------------------------------------------------------------- */
/* Keyboard selection                                                          */
/* -------------------------------------------------------------------------- */

export const KeyboardSelection: Story = {
  play: async ({ canvasElement }) => {
    const trigger = await getTrigger(canvasElement);

    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    const listbox = await getListbox();
    await expect(listbox).toBeVisible();

    await userEvent.keyboard("b");
    await userEvent.keyboard("{Enter}");

    await expect(trigger).toHaveTextContent("Banana");
  },
};

/* -------------------------------------------------------------------------- */
/* Associated label                                                            */
/* -------------------------------------------------------------------------- */

export const WithFormLabel: Story = {
  args: {
    id: "fruit",
    "aria-label": undefined,
  },
  render: (args) => (
    <div className="flex w-full flex-col gap-(--primitives-spacing-2)">
      <Label htmlFor="fruit">Fruit</Label>
      <Select {...args}>
        <SelectContent>{fruitItems()}</SelectContent>
      </Select>
    </div>
  ),
};
