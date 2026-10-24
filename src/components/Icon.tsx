import React, { lazy, Suspense } from "react";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { cn } from "@/lib/utils";

interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof dynamicIconImports;
}

// lazy() must be created once per icon, not on every render: a new lazy component each time
// remounts the icon and re-suspends it.
const iconCache = new Map<string, React.LazyExoticComponent<React.ComponentType<LucideProps>>>();

function getIcon(name: keyof typeof dynamicIconImports) {
  let LucideIcon = iconCache.get(name);
  if (!LucideIcon) {
    LucideIcon = lazy(dynamicIconImports[name]);
    iconCache.set(name, LucideIcon);
  }
  return LucideIcon;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = getIcon(name);

  return (
    // Invisible placeholder the size of the icon, so nothing flashes or shifts while it loads.
    <Suspense fallback={<span aria-hidden="true" className={cn("inline-block size-6", props.className)} />}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default Icon;
