'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useProducts } from '@/src/context/productContext';

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

  const containerRef = useRef<HTMLDivElement>(null);

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
      if (!containerRef.current?.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node)
      ) {
        setOpenHamburguerMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggleMenu = () => {
    setOpenHamburguerMenu(prev => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/products?search=${encodeURIComponent(search)}`);
    setShowDropdown(false);
  };

  const goToProduct = (id: number) => {
    setShowDropdown(false);
    setSearch('');
    router.push(`/products/${id}`);
  };

  return (
    <header className="nav_color">
      <nav className="flex justify-between items-center gap-6">

        <Link href="/" className="main_title_text">
          Magic Field
        </Link>

        <div className='flex justify-between items-center w-full gap-6'>
          {/* 🔎 buscador */}
          <div ref={containerRef} className="relative w-full">
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

            {/* ✅ dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white text-black rounded shadow-lg mt-1 z-50">

                {suggestions.map(product => (
                  <button
                    key={product.id}
                    onClick={() => goToProduct(product.id)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-3"
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
          </div>

          <div className="hidden md:flex header_tab_container" style={{ minWidth: '242px' }}>
            <Link href="/products" className="header_tab">
              Productos
            </Link>
            <Link href="/cart" className="header_tab">
              Carrito
            </Link>
            <Link href="/auth/login" className="header_tab">
              Ingresar
            </Link>
          </div>
          
          {/* ===== HAMBURGER BUTTON ===== */}
          <button
            onClick={toggleMenu}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>

          <div
            className={`fixed inset-0 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
              open ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          />

          <div
            ref={containerRef}
            className={`nav_dropdown nav_color transform transition-all duration-300 md:hidden z-50
            ${
              open
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <nav className="flex flex-col py-2">

              <Link
                href="/products"
                onClick={() => setOpenHamburguerMenu(false)}
                className="px-5 py-3 header_tab"
              >
                Productos
              </Link>

              <Link
                href="/cart"
                onClick={() => setOpenHamburguerMenu(false)}
                className="px-5 py-3 header_tab"
              >
                Carrito
              </Link>

              <Link
                href="/auth/login"
                onClick={() => setOpenHamburguerMenu(false)}
                className="px-5 py-3 header_tab"
              >
                Ingresar
              </Link>

            </nav>
          </div>
        </div>
      </nav>
    </header>
  );
}
