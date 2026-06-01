'use client';

import { Phone } from 'lucide-react';

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t pt-10 pb-6 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Columnas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-8">

                    {/* Columna Información */}
                    <div>
                        <h3 className="font-semibold text-gray-800 text-base mb-4">Información</h3>

                        <p className="text-sm font-medium text-gray-700 mb-2">Opciones de retiro y envío</p>
                        <ul className="text-sm text-gray-600 space-y-1 mb-4">
                            <li>📍 Retiro en Ramos Mejía — <span className="text-gray-400">[dirección]</span></li>
                            <li>📍 Retiro en Francisco Álvarez — <span className="text-gray-400">[dirección]</span></li>
                            <li>🚚 Envío a domicilio</li>
                            <li>📦 Envío a sucursal Andreani</li>
                        </ul>

                        <p className="text-sm font-medium text-gray-700 mb-1">¿Cómo funciona?</p>
                        <p className="text-sm text-gray-600">
                            Ingresá tus datos y nos comunicaremos contigo para coordinar la entrega al corto plazo.
                        </p>
                    </div>

                    {/* Columna Contacto */}
                    <div>
                        <h3 className="font-semibold text-gray-800 text-base mb-4">Contacto</h3>

                        <ul className="text-sm text-gray-600 space-y-3">
                            <li className="flex items-center gap-2">
                                <Phone size={16} strokeWidth={1.5} className="text-gray-500 shrink-0" />
                                <span className="text-gray-400">[número de teléfono]</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <InstagramIcon />
                                <a
                                    href="https://instagram.com/[usuario]"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-800 transition-colors text-gray-400"
                                >
                                    @[usuario]
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <FacebookIcon />
                                <a
                                    href="https://facebook.com/[pagina]"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-800 transition-colors text-gray-400"
                                >
                                    [nombre de página]
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Copyright */}
                <div className="border-t pt-4 text-center text-sm text-gray-500">
                    <p>&copy; 2026 Magic Field. Todos los derechos reservados.</p>
                </div>

            </div>
        </footer>
    );
}
