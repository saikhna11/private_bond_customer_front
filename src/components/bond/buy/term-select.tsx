import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/** The terms the picked option offers, one picked. */
export function TermSelect({
  id,
  terms,
  value,
  onChange,
}: {
  id: string;
  terms: number[];
  value: number | undefined;
  onChange: (months: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <Select
      value={value ? String(value) : ''}
      onValueChange={(v) => onChange(Number(v))}
      disabled={terms.length <= 1}
    >
      <SelectTrigger id={id} className="h-10! w-full">
        <SelectValue placeholder={t('bond.buy.termPlaceholder')} />
      </SelectTrigger>
      <SelectContent>
        {terms.map((m) => (
          <SelectItem key={m} value={String(m)}>
            {t('contract.months', { count: m })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
