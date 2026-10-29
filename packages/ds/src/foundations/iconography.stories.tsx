import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  FIGMA_PLACEHOLDER_LIBRARIES,
  ICON_COLOR_EXAMPLES,
  ICON_MAPPINGS,
  ICON_SIZES,
  REPRESENTATIVE_ICONS,
} from "./iconography-data";
import {
  IconColorBindingNote,
  IconColorSpecimen,
  IconFamilySpecimen,
  IconFilledExceptionSpecimen,
  IconMappingSpecimen,
  IconPipelineNote,
  IconSizeSpecimen,
  IconStrokeSpecimen,
  IconUtilitySizeNote,
} from "./iconography-specimen";

const meta = {
  title: "Foundations/Iconography",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const IconFamily: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col">
      <IconFamilySpecimen icons={REPRESENTATIVE_ICONS} libraries={FIGMA_PLACEHOLDER_LIBRARIES} />
    </div>
  ),
};

export const SizeUsage: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-8)">
      {ICON_SIZES.map((record) => (
        <IconSizeSpecimen key={record.px} record={record} icons={REPRESENTATIVE_ICONS} />
      ))}
      <IconUtilitySizeNote />
    </div>
  ),
};

export const Stroke: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-8)">
      <IconStrokeSpecimen icons={REPRESENTATIVE_ICONS} />
      <IconFilledExceptionSpecimen />
    </div>
  ),
};

export const Color: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-8)">
      <IconColorBindingNote />
      {ICON_COLOR_EXAMPLES.map((example) => (
        <IconColorSpecimen key={example.token} example={example} iconName="check" />
      ))}
    </div>
  ),
};

export const FigmaToCode: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-8)">
      <IconPipelineNote />
      {ICON_MAPPINGS.map((mapping) => (
        <IconMappingSpecimen key={mapping.reactName} mapping={mapping} />
      ))}
    </div>
  ),
};
