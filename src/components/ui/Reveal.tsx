import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Envoltura con entrada suave (opacity + leve desplazamiento).
 *
 * La animación es 100% CSS (ninguna dependencia de hidratación ni de
 * IntersectionObserver): si el JS no cargara, el contenido se muestra
 * igualmente al terminar la animation. El retardo escalonado se pasa
 * como variable CSS para que respete `animation-delay`.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  return (
    <div
      className={`reveal ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
