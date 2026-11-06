import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';

/** The first and the last day a list's rows were made; either may be left empty. */
export function DayRangeFilter({
  id,
  from,
  to,
  onChange,
}: {
  id: string;
  from?: string;
  to?: string;
  onChange: (range: { from?: string; to?: string }) => void;
}) {
  const { t } = useTranslation();
  const day = (which: 'from' | 'to') => (
    <Input
      id={`${id}-${which}`}
      type="date"
      aria-label={t(`filters.${which}`)}
      title={t(`filters.${which}`)}
      value={(which === 'from' ? from : to) ?? ''}
      min={which === 'to' ? from : undefined}
      max={which === 'from' ? to : undefined}
      onChange={(e) =>
        onChange({ from, to, [which]: e.target.value || undefined })
      }
      className="h-9 w-full sm:w-40"
    />
  );
  return (
    <>
      {day('from')}
      {day('to')}
    </>
  );
}
