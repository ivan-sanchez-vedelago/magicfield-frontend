'use client';

import LoadingLink from '@/src/components/navigation/LoadingLink';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useProducts } from '@/src/context/productContext';
import { useCategories } from '@/src/context/categoryContext';
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
  const { categories } = useCategories();
  const [showDropdown, setShowDropdown] = useState(false);
  const [open, setOpenHamburguerMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const { startNavigation } = useNavigation();

  const rootCategories = categories.filter(c => c.parentId === 0);

  const getCategoryChildren = (categoryId: number) =>
    categories.filter(c => c.parentId === categoryId);

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const productsMenuRef = useRef<HTMLDivElement>(null);

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

      if (
        !productsMenuRef.current?.contains(target)
      ) {
        setProductsMenuOpen(false);
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

  const handleCategoryClick = (shortName: string) => {
    setOpenHamburguerMenu(false);
    setProductsMenuOpen(false);
    setExpandedCategory(null);
    startNavigation();
    router.push(`/products?category=${shortName}`);
  };

  const renderCategoryTree = (onClose?: () => void) =>
    rootCategories.map(cat => {
      const children = getCategoryChildren(cat.id);
      const isExpanded = expandedCategory === cat.id;
      if (children.length > 0) {
        return (
          <div key={cat.id}>
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
              className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700 flex items-center justify-between"
            >
              {cat.name}
              <span className={`chevron transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}></span>
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => { handleCategoryClick(child.shortName); onClose?.(); }}
                  className="w-full text-left pl-8 pr-5 py-2 header_tab hover:bg-gray-700 text-sm"
                >
                  {child.name}
                </button>
              ))}
            </div>
          </div>
        );
      } else {
        return (
          <button
            key={cat.id}
            onClick={() => { handleCategoryClick(cat.shortName); onClose?.(); }}
            className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700"
          >
            {cat.name}
          </button>
        );
      }
    });

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

  const toggleProductsMenu = () => {
    setProductsMenuOpen(!productsMenuOpen);
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
            {/* ===== BACKDROP DESKTOP ===== */}
            <div
              className={`fixed inset-0 backdrop-blur-sm transition-opacity duration-300 hidden md:block z-40 ${
                productsMenuOpen || userMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
              }`}
              onClick={() => {
                setProductsMenuOpen(false);
                setUserMenuOpen(false);
              }}
            />
            
            <div ref={productsMenuRef}>
              <button onClick={toggleProductsMenu} className="header_tab cursor-pointer flex items-center gap-2">Productos <span className="chevron"></span></button>
              <div className={`nav_dropdown nav_color transform transition-all duration-300 fixed top-14 right-0 w-48 z-50 ${
                productsMenuOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-full pointer-events-none'
              }`}>
                <nav className="flex flex-col py-2">
                  {renderCategoryTree()}
                </nav>
              </div>
            </div>
            <LoadingLink href="/cart" className="header_tab relative">
              <ShoppingCart className="w-6 h-6 flex-shrink-0" />
              {cartItems.length > 0 && (
                <span className="absolute top-3 -right-2 text-white text-xs font-bold rounded-full w-4 h-4 flex justify-center" style={{ backgroundColor: '#700670' }}>
                  {cartItems.length}
                </span>
              )}
            </LoadingLink>
            
            {/* User Menu */}
            <div ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="header_tab flex items-center gap-1"
              >
                <User className="w-6 h-6 flex-shrink-0" />
              </button>
              <div className={`nav_dropdown nav_color transform transition-all duration-300 fixed top-14 right-0 w-48 z-50 ${
                userMenuOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-full pointer-events-none'
              }`}>
                <nav className="flex flex-col py-2">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-5 py-3 border-b border-gray-700">
                        <p className="small_text text-gray-400">Hola,</p>
                        <p className="font-semibold text-white truncate">{user.name}</p>
                      </div>
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700"
                      >
                        Mi Perfil
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 border-t border-gray-700 header_tab hover:bg-gray-700"
                      >
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLoginClick}
                        className="w-full text-left px-5 py-3 header_tab hover:bg-gray-700"
                      >
                        Iniciar Sesión
                      </button>
                      <LoadingLink
                        href="/auth/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left px-5 py-3 border-t border-gray-700 header_tab hover:bg-gray-700 block"
                      >
                        Registrarse
                      </LoadingLink>
                    </>
                  )}
                </nav>
              </div>
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
            className={`nav_dropdown nav_color transform transition-all duration-300 fixed top-14 right-0 w-48 z-50 md:hidden ${
              open
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-full pointer-events-none'
            }`}
          >
            <nav className="flex flex-col py-2">
              {renderCategoryTree(() => setOpenHamburguerMenu(false))}
              <LoadingLink href="/cart" onClick={() => setOpenHamburguerMenu(false)} className="px-5 py-3 header_tab flex items-center gap-2 relative">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 flex-shrink-0" />
                  {cartItems.length > 0 && (
                    <span className="absolute top-3 -right-2 text-white text-xs font-bold rounded-full w-4 h-4 flex justify-center" style={{ backgroundColor: '#700670' }}>
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