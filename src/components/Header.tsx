'use client';

import LoadingLink from '@/src/components/navigation/LoadingLink';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useProducts } from '@/src/context/productContext';
import { useNavigation } from '@/src/components/navigation/NavigationContext';

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrls?: string[];
};

export default function Header() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const { products } = useProducts();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [open, setOpenHamburguerMenu] = useState(false);
  const { startNavigation } = useNavigation();

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const goToProduct = (id: number) => {
    setShowDropdown(false);
    setSearch('');
    startNavigation();
    router.push(`/products/${id}`);
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
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                className="w-full px-3 py-2 rounded text-black"
              />
            </form>
          </div>

          <div className="hidden md:flex header_tab_container" style={{ minWidth: '242px' }}>
            <LoadingLink href="/products" className="header_tab">Productos</LoadingLink>
            <LoadingLink href="/cart" className="header_tab">Carrito</LoadingLink>
            <LoadingLink href="/auth/login" className="header_tab">Ingresar</LoadingLink>
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
              <LoadingLink href="/products" onClick={() => setOpenHamburguerMenu(false)} className="px-5 py-3 header_tab">Productos</LoadingLink>
              <LoadingLink href="/cart" onClick={() => setOpenHamburguerMenu(false)} className="px-5 py-3 header_tab">Carrito</LoadingLink>
              <LoadingLink href="/auth/login" onClick={() => setOpenHamburguerMenu(false)} className="px-5 py-3 header_tab">Ingresar</LoadingLink>
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