'use client';

import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';
import { useNavigation } from './NavigationContext';

type Props = LinkProps & {
  children: ReactNode;
  className?: string;
};

export default function LoadingLink({
  children,
  className,
  ...props
}: Props) {
  const { startNavigation } = useNavigation();

  return (
    <Link
      {...props}
      className={className}
      onClick={(e) => {
        startNavigation();

        // si el usuario abre en nueva pestaña no mostrar loading
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }
      }}
    >
      {children}
    </Link>
  );
}