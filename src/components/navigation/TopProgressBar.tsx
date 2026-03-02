'use client';

import { useEffect, useState } from 'react';
import { useNavigation } from './NavigationContext';

export default function TopProgressBar() {
  const { loading, stopNavigation } = useNavigation();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;

    setProgress(20);

    const t1 = setTimeout(() => setProgress(50), 120);
    const t2 = setTimeout(() => setProgress(80), 260);

    const finish = setTimeout(() => {
      setProgress(100);

      setTimeout(() => {
        setProgress(0);
        stopNavigation();
      }, 250);
    }, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(finish);
    };
  }, [loading, stopNavigation]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[9999] pointer-events-none">
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #22c55e, #4ade80)',
          boxShadow: '0 0 8px #22c55e'
        }}
      />
    </div>
  );
}