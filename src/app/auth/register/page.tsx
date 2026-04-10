'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/context/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const router = useRouter();
  const { register, isAuthenticated, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    validateForm();
  }, [name, email, password, confirmPassword]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (name && name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (name && name.length > 100) {
      newErrors.name = 'El nombre no debe exceder 100 caracteres';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (password && password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (
      confirmPassword &&
      password &&
      confirmPassword !== password
    ) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setIsSubmitting(true);

    if (
      errors.name ||
      errors.email ||
      errors.password ||
      errors.confirmPassword ||
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setIsSubmitting(false);
      return;
    }

    try {
      await register(name, email, password);
      router.push('/');
    } catch (err) {
      setServerError(error || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="box_border">
          <h1 className="title_text mb-2">Crear Cuenta</h1>
          <p className="normal_text text-gray-600 mb-6">
            Completa el formulario para registrarte
          </p>

          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="small_text text-red-600">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="normal_text font-semibold block mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`input_field w-full ${
                  errors.name && touched.name ? 'border-red-500' : ''
                }`}
                placeholder="Tu nombre"
              />
              {errors.name && touched.name && (
                <p className="small_text text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

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

            <div>
              <label className="normal_text font-semibold block mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`input_field w-full ${
                    errors.confirmPassword && touched.confirmPassword
                      ? 'border-red-500'
                      : ''
                  }`}
                  placeholder="Confirmar contraseña"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 small_text text-gray-600 hover:text-gray-900"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="small_text text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name || !email || !password || !confirmPassword}
              className={`button_primary w-full medium_button ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-200 pt-6">
            <p className="normal_text text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="font-bold text-green-700 hover:text-green-900">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
