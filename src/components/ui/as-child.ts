import * as React from "react";

export type AsChildProp = {
  asChild?: boolean;
};

export function splitAsChild(
  asChild: boolean | undefined,
  children: React.ReactNode
): {
  render?: React.ReactElement;
  children?: React.ReactNode;
} {
  if (asChild && React.isValidElement(children)) {
    return { render: children };
  }
  return { children };
}
