type MarqueeProps = {
  items: string[];
  /** Variante del tratamiento tipográfico. */
  tone?: "contorno" | "solido";
  /** Velocidad de la cinta (segundos por vuelta). */
  duration?: number;
  className?: string;
};

/**
 * Cinta horizontal infinita con el nombre de las colecciones.
 * Es el gesto gráfico que da energía al sitio: funciona como
 * separador entre bloques y como índice visual del catálogo.
 */
export function Marquee({
  items,
  tone = "contorno",
  duration = 32,
  className = "",
}: MarqueeProps) {
  const row = [...items, ...items];

  return (
    <div
      className={`relative overflow-hidden border-y border-linea py-5 ${className}`}
      aria-hidden="true"
    >
      <div
        className="cinta-fila"
        style={{ animationDuration: `${duration}s` }}
      >
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center">
            <span
              className={`font-poster px-7 text-3xl whitespace-nowrap sm:text-4xl ${
                tone === "contorno"
                  ? "text-contorno"
                  : "text-oro-metal opacity-70"
              }`}
            >
              {item}
            </span>
            <span
              className={`h-2.5 w-2.5 rotate-45 ${
                index % 3 === 0
                  ? "bg-rubi"
                  : index % 3 === 1
                    ? "bg-esmeralda"
                    : "bg-citrino"
              }`}
            />
          </span>
        ))}
      </div>

      {/* Desvanecido en los bordes para que la cinta no se corte. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-noche to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-noche to-transparent" />
    </div>
  );
}
