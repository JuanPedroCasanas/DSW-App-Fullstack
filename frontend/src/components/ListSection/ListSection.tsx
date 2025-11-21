// ListSection
type Props = {
  title: string;
  items: { label: string; to?: string; onClick?: () => void }[];
};

import { NavLink } from "react-router-dom";

export default function ListSection({ title, items }: Props) {
  return (
    <section className="grid gap-2">
      <h3 className="m-0 text-[clamp(1.05rem,0.95rem+0.4vw,1.25rem)] font-semibold">
        {title}
      </h3>
      <ul className="grid gap-2 list-none p-0 m-0">
        {items.map((item, i) => (
          <li key={i}>
            {item.to ? (
              <NavLink
                to={item.to}
                className="text-[var(--color-primary)] hover:underline"
              >
                {item.label}
              </NavLink>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="text-left text-[var(--color-primary)] hover:underline"
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
