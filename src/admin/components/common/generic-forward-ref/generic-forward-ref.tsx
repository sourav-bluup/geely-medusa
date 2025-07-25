import { forwardRef, ReactNode, Ref, RefAttributes } from 'react';

export function genericForwardRef<T, P = {}>(
  render: (props: P, ref: Ref<T>) => ReactNode,
): (props: P & RefAttributes<T>) => ReactNode {
  // @ts-expect-error
  return forwardRef(render) as any;
}
