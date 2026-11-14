type SectionHeadingProps = {
  kicker: string;
  title: string;
  intro?: string;
  id?: string;
  align?: "left" | "center";
  className?: string;
  /** Índice de capítulo (p. ej. «01»). */
  index?: string;
  /** Tinte del filete: oro o prisma. */
  accent?: "oro" | "prisma";
};

/**
 * Encabezado de sección con aire de capítulo de revista: número
 * en cartel, antetítulo técnico, titular en serif de alto contraste
 * y filete de luz.
 */
export function SectionHeading({
  kicker,
  title,
  intro,
  id,
  align = "left",
  className = "",
  index,
  accent = "oro",
}: SectionHeadingProps) {
  const center = align === "center";
  const line =
    accent === "prisma"
      ? "bg-prisma"
      : "bg-gradient-to-r from-oro to-transparent";

  return (
    <header
      id={id}
      className={`max-w-2xl ${center ? "mx-auto text-center" : ""} ${className}`}
    >
      <div
        className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}
      >
        {index ? (
          <span className="font-poster text-4xl leading-none text-prisma sm:text-5xl">
            {index}
          </span>
        ) : null}
        <p className="kicker">{kicker}</p>
      </div>

      <h2
        className={`font-display mt-5 text-[2.5rem] leading-[1.04] text-marfil sm:text-[3.25rem] ${
          center ? "mx-auto" : ""
        }`}
      >
        {title}
      </h2>

      <div
        className={`mt-7 h-px w-24 ${line} ${center ? "mx-auto" : ""}`}
        aria-hidden="true"
      />

      {intro ? (
        <p className={`mt-6 text-lg leading-relaxed text-humo ${center ? "mx-auto" : ""}`}>
          {intro}
        </p>
      ) : null}
    </header>
  );
}
