import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Field } from "./field";
import { FileUpload } from "./file-upload";

const meta = {
  title: "Components/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    error: {
      control: "boolean",
      description: "Marks the control as invalid. Mirrored to aria-invalid.",
    },
    disabled: {
      control: "boolean",
      description: "Prevents file selection and drag-and-drop.",
    },
    fileName: {
      control: "text",
      description: "Presentational filename shown when no file has been selected yet.",
    },
  },
  args: {
    "aria-label": "Upload a file",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

function getDropzone(canvasElement: HTMLElement) {
  const dropzone = canvasElement.querySelector("[data-slot='file-upload']");
  if (!(dropzone instanceof HTMLElement)) {
    throw new Error("File Upload dropzone not found");
  }
  return dropzone;
}

function getInput(canvasElement: HTMLElement) {
  return within(canvasElement).getByLabelText("Upload a file");
}

function getBrowseButton(canvasElement: HTMLElement) {
  return within(canvasElement).getByRole("button", { name: "Browse file" });
}

/* -------------------------------------------------------------------------- */
/* Empty                                                                       */
/* -------------------------------------------------------------------------- */

export const Empty: Story = {};

/* -------------------------------------------------------------------------- */
/* Uploaded                                                                    */
/* -------------------------------------------------------------------------- */

export const Uploaded: Story = {
  args: {
    fileName: "document.pdf",
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
    await expect(getInput(canvasElement)).toHaveAttribute("aria-invalid", "true");
  },
};

export const UploadedError: Story = {
  args: {
    error: true,
    fileName: "document.pdf",
  },
};

/* -------------------------------------------------------------------------- */
/* Focus                                                                       */
/* -------------------------------------------------------------------------- */

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);
    const browse = getBrowseButton(canvasElement);
    const dropzone = getDropzone(canvasElement);
    const nativeClick = input.click.bind(input);

    // Keep the system picker from opening so this play only checks pointer focus.
    input.click = () => {};

    try {
      await userEvent.click(browse);
    } finally {
      input.click = nativeClick;
    }

    await expect(browse).toHaveFocus();
    await expect(dropzone.matches(":focus-within")).toBe(true);
    await expect(dropzone).not.toHaveFocus();
  },
};

export const KeyboardFocus: Story = {
  name: "Focus Visible",
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);
    const browse = getBrowseButton(canvasElement);
    const dropzone = getDropzone(canvasElement);

    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expect(dropzone.matches(":focus-within")).toBe(true);
    await expect(dropzone).not.toHaveFocus();

    await userEvent.tab();
    await expect(browse).toHaveFocus();
    await expect(dropzone.matches(":focus-within")).toBe(true);
  },
};

/* -------------------------------------------------------------------------- */
/* Drag over                                                                   */
/* -------------------------------------------------------------------------- */

export const DragOver: Story = {
  play: async ({ canvasElement }) => {
    const dropzone = getDropzone(canvasElement);

    dropzone.dispatchEvent(new DragEvent("dragenter", { bubbles: true, cancelable: true }));
    await expect(await within(canvasElement).findByText("Drop your file here")).toBeInTheDocument();
    await expect(dropzone).toHaveAttribute("data-dragging", "true");
  },
};

export const DragOverError: Story = {
  args: {
    error: true,
  },
  play: async ({ canvasElement }) => {
    const dropzone = getDropzone(canvasElement);

    dropzone.dispatchEvent(new DragEvent("dragenter", { bubbles: true, cancelable: true }));
    await expect(await within(canvasElement).findByText("Drop your file here")).toBeInTheDocument();
    await expect(dropzone).toHaveAttribute("data-dragging", "true");
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
    await expect(getInput(canvasElement)).toBeDisabled();
  },
};

export const DisabledUploaded: Story = {
  args: {
    disabled: true,
    fileName: "document.pdf",
  },
};

/* -------------------------------------------------------------------------- */
/* File selection                                                              */
/* -------------------------------------------------------------------------- */

export const SelectFile: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = getInput(canvasElement);
    const file = new File(["hello"], "photo.png", { type: "image/png" });

    await userEvent.upload(input, file);
    await expect(canvas.getByText("photo.png")).toBeInTheDocument();
  },
};

export const DropFile: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dropzone = getDropzone(canvasElement);
    const file = new File(["hello"], "notes.pdf", { type: "application/pdf" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const dropEvent = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      dataTransfer,
    });
    // Chromium ignores constructor `dataTransfer` on synthetic DragEvents.
    Object.defineProperty(dropEvent, "dataTransfer", {
      value: dataTransfer,
    });
    dropzone.dispatchEvent(dropEvent);

    await expect(await canvas.findByText("notes.pdf")).toBeInTheDocument();
  },
};

/* -------------------------------------------------------------------------- */
/* Field                                                                       */
/* -------------------------------------------------------------------------- */

export const WithField: Story = {
  name: "Field",
  args: {
    "aria-label": undefined,
  },
  render: () => (
    <Field
      label="Attachment"
      htmlFor="file-upload-field"
      description="Attach a supporting document."
    >
      <FileUpload
        id="file-upload-field"
        aria-describedby="file-upload-field-description"
      />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Attachment");
    await expect(input).toHaveAttribute("id", "file-upload-field");
  },
};

export const WithFieldError: Story = {
  name: "Field Error",
  args: {
    "aria-label": undefined,
  },
  render: () => (
    <Field
      label="Attachment"
      htmlFor="file-upload-field-error"
      description="Please upload a JPEG, PNG, or PDF up to 5MB."
      error
    >
      <FileUpload
        id="file-upload-field-error"
        error
        aria-describedby="file-upload-field-error-description"
      />
    </Field>
  ),
};

/* -------------------------------------------------------------------------- */
/* Forwards ref                                                                */
/* -------------------------------------------------------------------------- */

export const ForwardsRef: Story = {
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLInputElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <FileUpload {...args} ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);

    await expect(input).toBeInstanceOf(HTMLInputElement);
    await expect(input.tagName).toBe("INPUT");
    await expect(input).toHaveAttribute("type", "file");
    await expect(input).toHaveAttribute("data-ref-tag", "INPUT");
  },
};
