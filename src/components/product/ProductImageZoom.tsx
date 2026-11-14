"use client";

import { useRef, useState } from "react";
import { PieceImage } from "@/components/ui/PieceImage";

type ProductImageZoomProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function ProductImageZoom({
  src,
  alt,
  priority = false,
}: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleTouch = () => {
    setIsZoomed((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className="group relative aspect-square cursor-zoom-in overflow-hidden"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouch}
      role="button"
      tabIndex={0}
      aria-label={`Ampliar imagem de ${alt}`}
    >
      <div
        className="absolute inset-0 bg-prisma opacity-10 blur-3xl"
        aria-hidden="true"
      />

      <PieceImage
        src={src}
        alt={alt}
        className="relative object-contain p-10 transition-transform duration-700 ease-editorial group-hover:scale-[1.01]"
        priority={priority}
        sizes="(min-width: 1024px) 58vw, 92vw"
      />

      {/* Lente de zoom - apenas desktop */}
      <div
        className="pointer-events-none absolute inset-0 hidden transition-opacity duration-500 lg:block"
        style={{
          opacity: isZoomed ? 1 : 0,
          backgroundImage: `url(${src})`,
          backgroundSize: "175%",
          backgroundPosition: `${position.x}% ${position.y}%`,
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      {/* Indicação mobile */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-noche/80 via-noche/40 to-transparent pb-4 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:hidden">
        <span className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-humo">
          {isZoomed ? "Toca para fechar" : "Toca para ampliar"}
        </span>
      </div>
    </div>
  );
}
