
type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionHeader({ title, subtitle }: Props) {
  return (
    <header className="grid gap-1">
      <h2 className="m-0 text-[clamp(1.25rem,1.1rem+0.8vw,1.75rem)] font-semibold pt-20">
        {title}
      </h2>
      {subtitle && (
        <p className="m-0 text-black/70 text-[0.95rem]">{subtitle}</p>
      )}
    </header>
  );
}
