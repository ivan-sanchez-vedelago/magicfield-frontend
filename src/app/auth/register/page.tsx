'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/context/authContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<number | ''>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    lastName: false,
    email: false,
    phone: false,
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
  }, [name, lastName, email, phone, password, confirmPassword]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };

    if (name && name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (name && name.length > 100) {
      newErrors.name = 'El nombre no debe exceder 100 caracteres';
    }

    if (lastName && lastName.length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (phone !== '') {
      const phoneStr = phone.toString();
      if (phoneStr.length < 8 || phoneStr.length > 15) {
        newErrors.phone = 'El teléfono debe tener entre 8 y 15 dígitos';
      }
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

    const hasErrors = Object.values(errors).some(err => err !== '');
    const isMissingFields = !name || !lastName || !email || !phone || !password || !confirmPassword;

    if (hasErrors || isMissingFields) {
      setIsSubmitting(false);
      setTouched({
        name: true, lastName: true, email: true, phone: true, password: true, confirmPassword: true 
      });
      return;
    }

    try {
      await register(name, lastName, email, phone, password);
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
          <h1 className="main_title_text mb-2">Crea tu cuenta</h1>
          <p className="normal_text text-gray-600 mb-6">
            Con tu cuenta podrás acceder a todas las funcionalidades y disfrutar de una experiencia personalizada.
          </p>

          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="small_text text-red-600">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`input_field w-full ${
                  errors.name && touched.name ? 'border-red-500' : ''
                }`}
                placeholder="Nombre"
              />
              {errors.name && touched.name && (
                <p className="small_text text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => handleBlur('lastName')}
                className={`input_field w-full ${
                  errors.lastName && touched.lastName ? 'border-red-500' : ''
                }`}
                placeholder="Apellido"
              />
              {errors.lastName && touched.lastName && (
                <p className="small_text text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
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
              <input
                type="number"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value;
                  setPhone(val === '' ? '' : Number(val));
                }}
                onBlur={() => handleBlur('phone')}
                className={`input_field w-full ${
                  errors.phone && touched.phone ? 'border-red-500' : ''
                } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                placeholder="Teléfono (ej: 1122334455)"
              />
              {errors.phone && touched.phone && (
                <p className="small_text text-red-500 mt-1">{errors.phone}</p>
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
                  style={{paddingRight: '2.5rem'}}
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <Eye 
                      size={20}
                      strokeWidth={2}
                      className='primary_text_color'  
                    />
                  ) : (
                    <EyeOff
                      size={20}
                      strokeWidth={2}
                      className='primary_text_color'
                    />
                  )}
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
                  style={{paddingRight: '2.5rem'}}
                  placeholder="Confirmar contraseña"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? (
                    <Eye 
                      size={20}
                      strokeWidth={2}
                      className='primary_text_color'  
                    />
                  ) : (
                    <EyeOff
                      size={20}
                      strokeWidth={2}
                      className='primary_text_color'
                    />
                  )}
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
              disabled={isSubmitting || !name || !lastName || !email || phone === '' || !password || !confirmPassword}
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