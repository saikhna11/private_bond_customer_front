import { useTranslation } from 'react-i18next';
import { StepperField } from './stepper-field';

/**
 * The term in months: typed, or stepped through the terms the picked option offers (its
 * range, on its frequency's months). A typed term outside them is the form's error.
 */
export function TermField({
  id,
  terms,
  value,
  onChange,
  invalid,
}: {
  id: string;
  terms: number[];
  value: number | undefined;
  onChange: (months: number | undefined) => void;
  invalid?: boolean;
}) {
  const { t } = useTranslation();
  const less =
    value === undefined ? undefined : terms.findLast((m) => m < value);
  const more = value === undefined ? terms[0] : terms.find((m) => m > value);
  return (
    <StepperField
      id={id}
      value={value}
      onChange={onChange}
      onLess={less}
      onMore={more}
      suffix={t('bond.buy.months')}
      lessLabel={t('bond.buy.termLess')}
      moreLabel={t('bond.buy.termMore')}
      digits={3}
      invalid={invalid}
    />
  );
}
