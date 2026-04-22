'use client';

import LoadingLink from '@/src/components/navigation/LoadingLink';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useProducts } from '@/src/context/productContext';
import { useNavigation } from '@/src/components/navigation/NavigationContext';
import { useAuth } from '@/src/context/authContext';
import { useCart } from '@/src/context/cartContext';
import type { Product } from '@/src/types';
import { ShoppingCart, User } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { items: cartItems } = useCart();

  const [search, setSearch] = useState('');
  const { products } = useProducts();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [open, setOpenHamburguerMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { startNavigation } = useNavigation();

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  }, [search, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !searchRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setShowDropdown(false);
      }

      if (
        !userMenuRef.current?.contains(target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpenHamburguerMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleMenu = () => {
    setOpenHamburguerMenu(prev => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    setShowDropdown(false);
    startNavigation();
    router.push(`/products?search=${encodeURIComponent(search)}`);
  };

  const goToProduct = (id: string) => {
    setShowDropdown(false);
    setSearch('');
    startNavigation();
    router.push(`/products/${id}`);
  };

  const handleCategoryClick = (category: string) => {
    setOpenHamburguerMenu(false);
    startNavigation();
    if (category === 'all') {
      router.push('/products');
    } else {
      router.push(`/products?category=${category}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    startNavigation();
    router.push('/');
  };

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    startNavigation();
    router.push('/perfil');
  };

  const handleLoginClick = () => {
    setUserMenuOpen(false);
    startNavigation();
    router.push('/auth/login');
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="nav_color relative">
      <nav className="flex justify-between items-center gap-6">

        {/* ===== LOGO ===== */}
        <LoadingLink href="/" className="flex items-center">
          <Image
            src="/images/magic-field-logo.png"
            alt="Magic Field"
            width={80}
            height={75}
            className="block object-contain"
            priority
          />
        </LoadingLink>

        <div className="flex justify-between items-center w-full gap-6">

          {/* ===== BUSCADOR ===== */}
          <div ref={searchRef} className="w-full">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                className="input_field pr-12"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div className="hidden md:flex header_tab_container gap-2">
            <div className="relative group">
              <button className="header_tab cursor-pointer flex items-center gap-2">Productos <span className="chevron"></span></button>
              <div className="absolute left-0 mt-0 w-48 bg-gray-900 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button onClick={() => handleCategoryClick('single')} className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white">Singles</button>
                <button onClick={() => handleCategoryClick('sealed')} className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white">Producto Sellado</button>
                <button onClick={() => handleCategoryClick('other')} className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white">Accesorios</button>
              </div>
            </div>
            <LoadingLink href="/cart" className="header_tab relative">
              <ShoppingCart className="w-6 h-6 flex-shrink-0" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </LoadingLink>
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="header_tab flex items-center gap-1"
              >
                <User className="w-6 h-6 flex-shrink-0" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded shadow-lg z-50">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="small_text text-gray-400">Hola,</p>
                        <p className="font-semibold text-white truncate">{user.name}</p>
                      </div>
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                      >
                        Mi Perfil
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white border-t border-gray-700"
                      >
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLoginClick}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                      >
                        Iniciar Sesión
                      </button>
                      <LoadingLink
                        href="/auth/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white border-t border-gray-700 block"
                      >
                        Registrarse
                      </LoadingLink>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ===== BOTON HAMBURGUESA ===== */}
          <button
            onClick={toggleMenu}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1"
          >
            <span className={`block w-6 h-0.5 bg-white transition ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>

          {/* ===== BACKDROP MOBILE ===== */}
          <div
            className={`fixed inset-0 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
              open ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          />

          {/* ===== MENU MOBILE ===== */}
          <div
            ref={menuRef}
            className={`nav_dropdown nav_color transform transition-all duration-300 md:hidden z-50
            ${
              open
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <nav className="flex flex-col py-2">
              <button onClick={() => handleCategoryClick('single')} className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700">Singles</button>
              <button onClick={() => handleCategoryClick('sealed')} className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700">Producto Sellado</button>
              <button onClick={() => handleCategoryClick('other')} className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700">Accesorios</button>
              <LoadingLink href="/cart" onClick={() => setOpenHamburguerMenu(false)} className="px-5 py-3 header_tab flex items-center gap-2 relative">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 flex-shrink-0" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                Carrito
              </LoadingLink>
              
              <div className="border-t border-gray-700 mt-2 pt-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-5 py-3">
                      <p className="small_text text-gray-400">Hola,</p>
                      <p className="font-semibold text-white truncate">{user.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleProfileClick();
                        setOpenHamburguerMenu(false);
                      }}
                      className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700"
                    >
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpenHamburguerMenu(false);
                      }}
                      className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleLoginClick();
                        setOpenHamburguerMenu(false);
                      }}
                      className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700"
                    >
                      Iniciar Sesión
                    </button>
                    <LoadingLink
                      href="/auth/register"
                      onClick={() => setOpenHamburguerMenu(false)}
                      className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700 block"
                    >
                      Registrarse
                    </LoadingLink>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </nav>

      {/* ===== DROPDOWN ===== */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="
            absolute top-full left-1/2 -translate-x-1/2
            w-full max-w-5xl
            bg-white text-black rounded shadow-lg mt-2 z-50
          "
        >
          {suggestions.map(product => (
            <button
              key={product.id}
              onClick={() => goToProduct(product.id)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3"
            >
              {product.imageUrls?.[0] && (
                <img
                  src={product.imageUrls[0]}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              {product.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}