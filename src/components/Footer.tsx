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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-8">

                    <div>
                        <p className="font-semibold text-gray-800 text-base mb-4">¿Cómo hacer un pedido?</p>
                        <p className="text-sm text-gray-600">
                            Agrega productos al carrito, ingresá tus datos y confirma el pedido. Nos comunicaremos contigo en el corto plazo para coordinar el retiro o envio.
                        </p>
                    </div>
                    {/* Columna Información */}
                    <div>
                        <p className="font-semibold text-gray-800 text-base mb-4">Opciones de retiro y envío</p>
                        <ul className="text-sm text-gray-600 space-y-1 mb-4">
                            <li>📍 Retiro en Ramos Mejía — <span className="text-gray-400">[A coordinar]</span></li>
                            <li>📍 Retiro en Francisco Álvarez — <span className="text-gray-400">[A coordinar]</span></li>
                            <li>📦 Envío a domicilio</li>
                            <li>📦 Envío a sucursal de Andreani</li>
                        </ul>
                    </div>

                    {/* Columna Contacto */}
                    <div>
                        <h3 className="font-semibold text-gray-800 text-base mb-4">Contacto</h3>

                        <ul className="text-sm text-gray-600 space-y-3">
                            <li className="flex items-center gap-2">
                                <Phone size={16} strokeWidth={1.5} className="text-gray-500 shrink-0" />
                                <span className="text-gray-400">1134782502</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <InstagramIcon />
                                <a
                                    href="https://instagram.com/magicfield_oeste"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-800 transition-colors text-gray-400"
                                >
                                    @magicfield_oeste
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <FacebookIcon />
                                <a
                                    href="https://facebook.com/share/1BA8BgAByY/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-800 transition-colors text-gray-400"
                                >
                                    Magic Field
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
