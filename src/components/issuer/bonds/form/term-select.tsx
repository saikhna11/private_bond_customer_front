import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Frequency } from '@/queries/bond/type';
import { termChoices } from './rate-option-rules';

/** A term in months, picked from the ones frequency takes, from from on. */
export function TermSelect({
  value,
  onChange,
  frequency,
  from,
  label,
  invalid,
}: {
  value: number;
  onChange: (term: number) => void;
  frequency: Frequency;
  from?: number;
  label: string;
  invalid?: boolean;
}) {
  const { t } = useTranslation();
  const choices = termChoices(frequency, from);
  return (
    <Select
      value={choices.includes(value) ? String(value) : ''}
      onValueChange={(v) => onChange(Number(v))}
    >
      <SelectTrigger
        aria-label={label}
        aria-invalid={invalid}
        className="tabular-nums h-10! w-full"
      >
        <SelectValue placeholder={t('issuer.bonds.form.pick')} />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-72">
        {choices.map((m) => (
          <SelectItem key={m} value={String(m)}>
            {t('issuer.bonds.form.months', { count: m })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
