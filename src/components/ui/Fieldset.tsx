import {
  Field as HeadlessField,
  Label as HeadlessLabel,
  type FieldProps as HeadlessFieldProps,
  type LabelProps as HeadlessLabelProps,
} from "@headlessui/react";
import { clsx } from "clsx";

export function Field({ className, ...props }: HeadlessFieldProps) {
  return (
    <HeadlessField
      className={clsx(
        className,
        "[&>[data-slot=label]+[data-slot=control]]:mt-3",
        "[&>[data-slot=label]]:font-medium",
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: { className?: string } & HeadlessLabelProps) {
  return (
    <HeadlessLabel
      {...props}
      data-slot="label"
      className={clsx(
        className,
        "select-none text-base/6 text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white",
      )}
    />
  );
}