'use client';

import { useAuth } from '@/src/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="normal_text">Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="box_border">
          <h1 className="title_text mb-6">Mi Perfil</h1>

          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-200">
              <p className="small_text text-gray-600 uppercase tracking-wide">
                Nombre
              </p>
              <input
                type="text"
                value={user.name}
                className={`input_field w-full mb-6`}
                disabled={true}
              />
              
              <p className="small_text text-gray-600 uppercase tracking-wide">
                Apellido
              </p>
              <input
                type="text"
                value={user.lastName}
                className={`input_field w-full mb-6`}
                disabled={true}
              />

              <p className="small_text text-gray-600 uppercase tracking-wide">
                Telefono
              </p>
              <input
                type="number"
                value={user.phone}
                className={`input_field w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                disabled={true}
              />
            </div>

            <div className="pb-4 border-b border-gray-200">
              <p className="small_text text-gray-600 uppercase tracking-wide">
                Email
              </p>
              <input
                type="email"
                value={user.email}
                className={`input_field w-full`}
                disabled={true}
              />
            </div>

            <div className="pt-2">
              <p className="small_text text-gray-500">
                Miembro desde: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`button_primary w-full medium_button mt-8 ${
              isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
