// ActionGrid.tsx
import { PropsWithChildren } from "react";

/**
 * Grid responsivo: auto-fit/minmax en mobile; flex wrap en md+.
 * Sustituye .dc-actions del CSS original.
 */
export default function ActionGrid({ children }: PropsWithChildren) {
  return (
    <div
      className="
        grid [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]
        gap-3 items-stretch
        md:flex md:flex-wrap md:gap-3
      "
    >
      {children}
    </div>
  );
}
