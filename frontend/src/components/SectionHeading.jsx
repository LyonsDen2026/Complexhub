export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="text-den-orange text-xs uppercase tracking-[0.2em] mb-2">{eyebrow}</div>
      )}
      <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide">{title}</h1>
      {subtitle && <p className="text-den-muted mt-2 max-w-2xl">{subtitle}</p>}
    </div>
  );
}
