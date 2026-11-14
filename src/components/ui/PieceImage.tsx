import Image from "next/image";

type PieceImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Imagen de pieza.
 *
 * Las ilustraciones de demostración son SVG: para ellas se
 * desactiva la optimización (Next no rasteriza SVG). Las fotos
 * reales que llegan del panel (CDN de Sanity) sí se optimizan.
 * El contenedor padre debe ser `relative` con tamaño definido.
 */
export function PieceImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 92vw",
}: PieceImageProps) {
  const isSvg = src.toLowerCase().endsWith(".svg");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized={isSvg}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
