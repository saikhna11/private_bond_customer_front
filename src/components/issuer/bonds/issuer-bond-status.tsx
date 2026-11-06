import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { IssuerBondType } from '@/queries/issuer-bond/type';

const tone: Record<IssuerBondType['sales_status'], string> = {
  draft: 'bg-warning/15 text-warning-foreground dark:text-warning',
  upcoming: 'bg-primary/10 text-primary',
  selling: 'bg-success/12 text-success',
  paused: 'bg-warning/15 text-warning-foreground dark:text-warning',
  closed: 'bg-muted text-muted-foreground',
  rejected: 'bg-destructive/10 text-destructive',
};

/** Where one of the issuer's bonds stands; a draft request reads as being reviewed. */
export function IssuerBondStatus({ b }: { b: IssuerBondType }) {
  const { t } = useTranslation();
  const label =
    b.sales_status === 'draft' && b.requested_at
      ? t('issuer.bonds.status.reviewing')
      : t(`issuer.bonds.status.${b.sales_status}`);
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        tone[b.sales_status],
      )}
    >
      {label}
    </span>
  );
}
