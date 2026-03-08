interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800">{children}</h2>
      <div className="mt-2 h-0.5 w-14 rounded-full bg-teal-500" aria-hidden />
    </div>
  );
}
