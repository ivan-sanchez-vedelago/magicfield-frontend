'use client';

import { useEffect, useState } from 'react';
import { useNavigation } from './NavigationContext';

export default function TopProgressBar() {
  const { loading, stopNavigation } = useNavigation();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setProgress(15);

      // Trepa hacia el 90% sin llegar nunca sola: mientras siga cargando, sigue avisando
      // que sigue en curso en vez de completarse y quedar "muerta" a mitad de camino.
      const trickle = setInterval(() => {
        setProgress((p) => (p < 90 ? p + (90 - p) * 0.1 : p));
      }, 200);

      // Red de seguridad: si la navegación nunca dispara el cambio de ruta (misma URL,
      // navegación cancelada, etc.), no dejar la barra pegada para siempre.
      const safety = setTimeout(() => stopNavigation(), 8000);

      return () => {
        clearInterval(trickle);
        clearTimeout(safety);
      };
    }

    // loading pasó a false porque la ruta de destino ya se montó: completar y ocultar.
    setProgress((p) => (p > 0 ? 100 : 0));
    const hide = setTimeout(() => setProgress(0), 250);
    return () => clearTimeout(hide);
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