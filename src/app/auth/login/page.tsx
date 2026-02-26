'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/src/components/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // TODO: Implementar autenticación con Firebase
    console.log('Login:', { email, password });

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pestaña no disponible</h1>
          <p className="text-xl text-gray-600 mb-8">
            Todavia no se encuentra disponible la pestaña de login, pero puedes explorar nuestro catálogo de productos mientras tanto.
          </p>
        </section>
        {/*
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Ingresar</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 rounded font-medium hover:bg-gray-800 disabled:bg-gray-400"
            >
              {isLoading ? 'Cargando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="text-black font-medium hover:underline">
                Registrarse
              </Link>
            </p>
          </div>
        </div>
        */}
      </main>
    </div>
  );
}
