import type { ReactNode } from 'react';

/** One group of the bond request form, laid out as the admin's bond form (BondFormSection). */
export function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-6 py-8 first:pt-0 last:pb-0"
    >
      {children}
    </section>
  );
}
