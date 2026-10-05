import * as React from "react";

import { cn } from "@/lib/utils";
import "@/lib/focus-intent";
import { Icon, iconBox20 } from "@/components/icon";
import { Button } from "@/components/ui/button";

const EMPTY_PROMPT = "Choose a file or drag & drop it here";
const DRAG_PROMPT = "Drop your file here";
const HELPER_TEXT = "JPEG, PNG or PDF format, up to 5MB";

export interface FileUploadProps
  extends Omit<React.ComponentProps<"input">, "type" | "size" | "value"> {
  /** Marks the control as invalid. Mirrored to `aria-invalid` on the native file input. */
  error?: boolean;
  /** Presentational filename shown when no file has been selected yet. */
  fileName?: string;
}

function assignFile(input: HTMLInputElement, file: File) {
  const transfer = new DataTransfer();
  transfer.items.add(file);
  input.files = transfer.files;
}

export function FileUpload({
  className,
  error = false,
  fileName,
  disabled,
  onChange,
  ref,
  ...props
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragCountRef = React.useRef(0);
  const [selectedName, setSelectedName] = React.useState<string | undefined>();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const displayedName = selectedName ?? fileName;
  const isUploaded = Boolean(displayedName);
  const showErrorChrome = error && !isDragging && !disabled;

  React.useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const doc = input.ownerDocument;

    const syncFocused = (event?: Event) => {
      if (event && (event.type === "blur" || event.type === "focusout")) {
        // Window/iframe focus loss reports relatedTarget null and can
        // briefly point activeElement at body, then restore the input
        // without a following focus event. Keep the current mapping.
        if ((event as FocusEvent).relatedTarget === null) return;
      }

      setIsFocused(doc.activeElement === input);
    };

    syncFocused();
    input.addEventListener("focus", syncFocused);
    input.addEventListener("blur", syncFocused);
    doc.addEventListener("focusin", syncFocused);
    doc.addEventListener("focusout", syncFocused);
    return () => {
      input.removeEventListener("focus", syncFocused);
      input.removeEventListener("blur", syncFocused);
      doc.removeEventListener("focusin", syncFocused);
      doc.removeEventListener("focusout", syncFocused);
    };
  }, []);

  function openPicker() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedName(event.target.files?.[0]?.name);
    onChange?.(event);
  }

  function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    dragCountRef.current += 1;
    setIsDragging(true);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    dragCountRef.current = Math.max(0, dragCountRef.current - 1);
    if (dragCountRef.current === 0) {
      setIsDragging(false);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCountRef.current = 0;
    setIsDragging(false);
    if (disabled) return;

    const file = event.dataTransfer.files[0];
    const input = inputRef.current;
    if (!file || !input) return;

    assignFile(input, file);
    handleChange({
      target: input,
      currentTarget: input,
    } as React.ChangeEvent<HTMLInputElement>);
  }

  return (
    <div
      data-slot="file-upload"
      data-dragging={isDragging ? "true" : undefined}
      data-focused={isFocused ? "true" : undefined}
      className={cn(
        `relative box-border flex w-full flex-col items-center justify-center
         h-(--primitives-spacing-out-of-scale-35) gap-(--primitives-spacing-2)
         rounded-(--primitives-radius-rounded-14)
         border-solid border-(length:--primitives-stroke-width-stroke)
         [border-color:transparent]
         bg-background px-(--primitives-spacing-out-of-scale-2-5) py-(--primitives-spacing-0)
         [--file-upload-stroke:var(--semantics-colors-border-default)]
         [--file-upload-stroke-width:var(--primitives-stroke-width-stroke)]
         has-aria-invalid:[--file-upload-stroke:var(--semantics-colors-border-destructive)]
         data-[focused=true]:border-(length:--primitives-stroke-width-stroke-2)
         data-[focused=true]:px-(--primitives-spacing-out-of-scale-2-25)
         data-[focused=true]:[--file-upload-stroke-width:var(--primitives-stroke-width-stroke-2)]
         data-[focused=true]:[--file-upload-stroke:var(--semantics-colors-border-strong)]
         has-aria-invalid:data-[focused=true]:[--file-upload-stroke:var(--semantics-colors-border-destructive)]
         focus-within:border-(length:--primitives-stroke-width-stroke-2)
         focus-within:px-(--primitives-spacing-out-of-scale-2-25)
         focus-within:[--file-upload-stroke-width:var(--primitives-stroke-width-stroke-2)]
         focus-within:[--file-upload-stroke:var(--semantics-colors-border-strong)]
         has-aria-invalid:focus-within:[--file-upload-stroke:var(--semantics-colors-border-destructive)]
         data-[dragging=true]:border-(length:--primitives-stroke-width-stroke-2)
         data-[dragging=true]:px-(--primitives-spacing-out-of-scale-2-25)
         data-[dragging=true]:[--file-upload-stroke-width:var(--primitives-stroke-width-stroke-2)]
         data-[dragging=true]:[--file-upload-stroke:var(--semantics-colors-border-strong)]
         data-[dragging=true]:[background-color:var(--semantics-colors-interaction-file-upload-drag-over)]
         intent-keyboard:data-[focused=true]:[outline:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
         intent-keyboard:data-[focused=true]:[outline-offset:var(--primitives-spacing-out-of-scale-0-75)]
         intent-keyboard:focus-within:[outline:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
         intent-keyboard:focus-within:[outline-offset:var(--primitives-spacing-out-of-scale-0-75)]
         has-disabled:[--file-upload-stroke:var(--semantics-colors-border-default)]
         has-disabled:opacity-(--primitives-opacity-opacity-45)
         has-disabled:pointer-events-none has-disabled:cursor-default
         [&_svg]:pointer-events-none [&_svg]:shrink-0`,
        className,
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute overflow-visible
          [top:calc(-1*var(--file-upload-stroke-width))]
          [left:calc(-1*var(--file-upload-stroke-width))]
          [width:calc(100%+2*var(--file-upload-stroke-width))]
          [height:calc(100%+2*var(--file-upload-stroke-width))]"
      >
        <rect
          fill="none"
          rx="calc(var(--primitives-radius-rounded-14) - var(--file-upload-stroke-width) / 2)"
          ry="calc(var(--primitives-radius-rounded-14) - var(--file-upload-stroke-width) / 2)"
          stroke="var(--file-upload-stroke)"
          strokeDasharray="6 6"
          strokeWidth="var(--file-upload-stroke-width)"
          height="calc(100% - var(--file-upload-stroke-width))"
          width="calc(100% - var(--file-upload-stroke-width))"
          x="calc(var(--file-upload-stroke-width) / 2)"
          y="calc(var(--file-upload-stroke-width) / 2)"
        />
      </svg>
      <input
        {...props}
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        type="file"
        disabled={disabled}
        aria-invalid={error}
        onChange={handleChange}
        className="sr-only"
      />
      <Icon
        name={isUploaded ? "file" : "upload"}
        size={iconBox20}
        aria-hidden="true"
        className={
          showErrorChrome
            ? "[color:var(--semantics-colors-foreground-destructive)]"
            : "[color:var(--semantics-colors-foreground-default)]"
        }
      />
      <p
        className={cn(
          `m-0 max-w-full truncate text-center
           font-sans [font-weight:var(--semantics-typography-body-font-weight)]
           text-(length:--semantics-typography-body-body-lg-font-size)
           leading-(--semantics-typography-body-body-lg-lh-normal)
           tracking-(--semantics-typography-body-body-lg-tracking-tight)`,
          showErrorChrome
            ? "[color:var(--semantics-colors-foreground-destructive)]"
            : "[color:var(--semantics-colors-foreground-default)]",
        )}
      >
        {isDragging ? DRAG_PROMPT : isUploaded ? displayedName : EMPTY_PROMPT}
      </p>
      <p
        className={`m-0 max-w-full text-center
          font-sans [font-weight:var(--semantics-typography-body-font-weight)]
          text-(length:--semantics-typography-body-body-sm-font-size)
          leading-(--semantics-typography-body-body-sm-lh-normal)
          tracking-(--semantics-typography-body-body-sm-tracking-tight)
          [color:var(--semantics-colors-foreground-subtle)]`}
      >
        {HELPER_TEXT}
      </p>
      <Button type="button" variant="outline" size="xs" tabIndex={disabled ? -1 : undefined} onClick={openPicker}>
        Browse file
      </Button>
    </div>
  );
}
