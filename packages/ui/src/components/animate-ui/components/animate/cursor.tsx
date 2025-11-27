import * as React from 'react';

import {
  CursorProvider as CursorProviderPrimitive,
  Cursor as CursorPrimitive,
  CursorFollow as CursorFollowPrimitive,
  CursorContainer as CursorContainerPrimitive,
  type CursorProviderProps as CursorProviderPropsPrimitive,
  type CursorContainerProps as CursorContainerPropsPrimitive,
  type CursorProps as CursorPropsPrimitive,
  type CursorFollowProps as CursorFollowPropsPrimitive,
} from '../../primitives/animate/cursor';
import { cn } from '@workspace/ui/lib/utils';
import { BsCursorFill } from 'react-icons/bs';

type CursorProviderProps = Omit<CursorProviderPropsPrimitive, 'children'> &
  CursorContainerPropsPrimitive;

function CursorProvider({ global, ...props }: CursorProviderProps) {
  return (
    <CursorProviderPrimitive global={global}>
      <CursorContainerPrimitive {...props} />
    </CursorProviderPrimitive>
  );
}

type CursorProps = Omit<CursorPropsPrimitive, 'children' | 'asChild'>;

function Cursor({ className, ...props }: CursorProps) {
  return (
    <CursorPrimitive asChild {...props}>
      <div className={cn('size-6 -rotate-90', className)}>
        <BsCursorFill
          className="size-full text-white dark:text-black transition-colors duration-200"
          style={{
            filter: 'var(--cursor-shadow)'
          }}
        />
      </div>
    </CursorPrimitive>
  );
}

type CursorFollowProps = Omit<CursorFollowPropsPrimitive, 'asChild'>;

function CursorFollow({
  className,
  children,
  sideOffset = 15,
  alignOffset = 5,
  ...props
}: CursorFollowProps) {
  return (
    <CursorFollowPrimitive
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      asChild
      {...props}
    >
      <div
        className={cn(
          'bg-foreground rounded-md text-background px-2 py-1 text-sm',
          className,
        )}
      >
        {children}
      </div>
    </CursorFollowPrimitive>
  );
}

export {
  CursorProvider,
  Cursor,
  CursorFollow,
  type CursorProviderProps,
  type CursorProps,
  type CursorFollowProps,
};
