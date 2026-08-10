'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

type Props = {
  images: string[]
  name: string
}

export default function ProductImageGallery({ images, name }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({})

  const imageRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  // Mismo mecanismo que BannerSlider (banners del inicio): todas las imágenes montadas de
  // una en una fila desplazada con translateX, en vez del fade anterior -- así el slide se
  // ve animado en vez de simplemente aparecer, y ya están todas pedidas desde el primer
  // render (no recién al cambiar de índice, que era lo que generaba el retraso).
  const changeImage = (index: number) => {
    setSelectedIndex(index)
  }

  const nextImage = () => {
    changeImage((selectedIndex + 1) % images.length)
  }

  const prevImage = () => {
    changeImage(
      (selectedIndex - 1 + images.length) % images.length
    )
  }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return

        const rect = imageRef.current.getBoundingClientRect()

        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(2.5)'
        })
    }

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)' })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return

    const diff = touchStartX.current - e.changedTouches[0].clientX

    if (diff > 50) nextImage()
    if (diff < -50) prevImage()

    touchStartX.current = null
  }

  if (!images || images.length === 0) return null

  return (
    <div className="flex flex-col gap-4 w-full">

        {/* Imagen principal */}
        <div
        ref={imageRef}
        className="relative overflow-hidden border rounded-xl bg-white"
        style={{ height: '420px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        >
            <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
            >
                {images.map((img, index) => (
                    <div
                        key={img}
                        className="relative w-full h-full flex-shrink-0 transition-transform duration-200 ease-out"
                        style={index === selectedIndex ? zoomStyle : undefined}
                    >
                        <Image
                          src={img}
                          alt={`${name} ${index}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 800px"
                          unoptimized
                          className="object-contain"
                          priority={index === 0}
                        />
                    </div>
                ))}
            </div>
        </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="relative">
            <div className="flex gap-3 overflow-x-auto py-1">
            {images.map((img, index) => (
                <button
                key={index}
                onClick={() => changeImage(index)}
                className={`relative border rounded-lg p-1 transition-all duration-200 ${
                    selectedIndex === index
                    ? 'border-black scale-105'
                    : 'border-gray-300 opacity-70 hover:opacity-100'
                }`}
                >
                <Image
                    src={img}
                    alt={`${name} ${index}`}
                    width={70}
                    height={70}
                    unoptimized
                    className="object-contain"
                />

                {selectedIndex === index && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-b-lg transition-all duration-200" />
                )}
                </button>
            ))}
                {/* Flechas */}
                {images.length > 1 && (
                <>
                    <button
                    onClick={prevImage}
                    className="image_slideshow_arrow left-2 h-8 flex items-center"
                    style={{ alignSelf: 'center' }}
                    >
                    ‹
                    </button>

                    <button
                    onClick={nextImage}
                    className="image_slideshow_arrow right-2 h-8 flex items-center"
                    style={{ alignSelf: 'center' }}
                    >
                    ›
                    </button>
                </>
                )}
            </div>
        </div>
      )}
    </div>
  )
}