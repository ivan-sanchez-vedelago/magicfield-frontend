'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/context/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const router = useRouter();
  const { login, isAuthenticated, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const validateForm = () => {
    const newErrors = { email: '', password: '' };

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (password && password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setIsSubmitting(true);

    if (errors.email || errors.password || !email || !password) {
      setIsSubmitting(false);
      return;
    }

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setServerError(
        error || 'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="box_border">
          <h1 className="title_text mb-2">Inicia Sesión</h1>
          <p className="normal_text text-gray-600 mb-6">
            Completa el formulario para acceder a tu cuenta
          </p>

          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="small_text text-red-600">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="normal_text font-semibold block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`input_field w-full ${
                  errors.email && touched.email ? 'border-red-500' : ''
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && touched.email && (
                <p className="small_text text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="normal_text font-semibold block mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`input_field w-full ${
                    errors.password && touched.password
                      ? 'border-red-500'
                      : ''
                  }`}
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 small_text text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="small_text text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className={`button_primary w-full medium_button ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-200 pt-6">
            <p className="normal_text text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="font-bold text-green-700 hover:text-green-900">
                Registrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
