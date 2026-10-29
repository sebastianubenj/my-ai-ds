import * as React from "react";

import { cn } from "@/lib/utils";
import { Description } from "@/components/ui/description";
import { Title, type TitleLevel } from "@/components/ui/title";

export interface PageHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  titleAs?: TitleLevel;
}

export function PageHeader({
  title,
  description,
  titleAs,
  className,
  ref,
  ...props
}: PageHeaderProps) {
  const showDescription = description != null && description !== false && description !== "";

  return (
    <div
      data-slot="page-header"
      className={cn(
        `flex w-full flex-col items-start gap-(--primitives-spacing-1)
         pt-(--primitives-spacing-2) md:pt-(--primitives-spacing-4)`,
        className,
      )}
      ref={ref}
      {...props}
    >
      <Title as={titleAs}>{title}</Title>
      {showDescription ? <Description>{description}</Description> : null}
    </div>
  );
}
