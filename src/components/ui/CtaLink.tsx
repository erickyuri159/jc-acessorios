import type { AnchorHTMLAttributes, ReactNode } from "react";

type CtaLinkProps = {
  variant?: "gold" | "outline" | "prisma" | "ghost";
  href: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href">;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] transition-all duration-300 ease-editorial";

const styles: Record<string, string> = {
  gold: "btn-primary",
  outline: "btn-outline",
  prisma: "btn-prisma",
  ghost: "inline-flex items-center justify-center gap-2 px-1 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-marfil underline decoration-oro/50 underline-offset-8 transition-colors duration-300 hover:text-oro hover:decoration-oro",
};

/**
 * Enlace de llamada a la acción. Cuatro variantes:
 *   gold    — metal (por defecto)
 *   outline — cristal con filete
 *   prisma  — el acento de color de la marca
 *   ghost   — solo texto con subrayado
 */
export function CtaLink({
  variant = "gold",
  href,
  external = false,
  children,
  className = "",
  ...rest
}: CtaLinkProps) {
  return (
    <a
      href={href}
      className={`${base} ${styles[variant] ?? styles.gold} ${className}`.trim()}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
