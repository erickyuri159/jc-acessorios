type WordmarkProps = {
  name: string;
  subtitle?: string;
  className?: string;
};

/**
 * Lockup de marca: monograma «JP» dentro de una esquina tallada
 * (como una gema) + nombre en serif editorial + subtítulo muy
 * espaciado. El monograma lleva el punto de prisma.
 */
export function Wordmark({
  name,
  subtitle = "Accesorios",
  className = "",
}: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="relative grid h-10 w-10 shrink-0 place-items-center bg-gradient-to-br from-oro-claro via-oro to-oro-profundo text-noche gem-cut-sm">
        <span className="font-display text-base leading-none font-bold tracking-tight">
          JP
        </span>
        <span
          className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-prisma"
          aria-hidden="true"
        />
      </span>

      <span className="inline-block">
        <span className="font-display block text-lg leading-none font-semibold tracking-tight text-marfil">
          {name}
        </span>
        <span className="mt-1 block text-[0.5rem] font-bold uppercase tracking-[0.36em] text-humo">
          {subtitle}
        </span>
      </span>
    </span>
  );
}
