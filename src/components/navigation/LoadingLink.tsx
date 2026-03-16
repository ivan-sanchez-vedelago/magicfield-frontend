'use client';

import Link, { LinkProps } from 'next/link';
import { ReactNode, MouseEvent } from 'react';
import { useNavigation } from './NavigationContext';

type Props = LinkProps & {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export default function LoadingLink({
  children,
  className,
  onClick,
  ...props
}: Props) {
  const { startNavigation } = useNavigation();

  return (
    <Link
      {...props}
      className={className}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }

        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }
        startNavigation();
      }}
    >
      {children}
    </Link>
  );
}