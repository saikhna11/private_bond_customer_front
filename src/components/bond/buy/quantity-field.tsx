import { useTranslation } from 'react-i18next';
import { StepperField } from './stepper-field';

/** The most digits of a quantity: more bonds than any bond sells. */
const maxDigits = 6;

/**
 * How many bonds the client buys: typed, or stepped one at a time between min and max.
 * Cleared, it reads 1: it is never empty.
 */
export function QuantityField({
  id,
  value,
  min,
  max,
  onChange,
  invalid,
}: {
  id: string;
  value: number | undefined;
  min: number;
  max: number;
  onChange: (quantity: number | undefined) => void;
  invalid?: boolean;
}) {
  const { t } = useTranslation();
  const less = value && value > min ? Math.min(max, value - 1) : undefined;
  const more =
    value === undefined || value < max
      ? Math.max(min, (value ?? min - 1) + 1)
      : undefined;
  return (
    <StepperField
      id={id}
      value={value}
      onChange={onChange}
      onLess={less !== undefined && less >= min ? less : undefined}
      onMore={more !== undefined && more <= max ? more : undefined}
      suffix={t('bond.buy.pieces')}
      lessLabel={t('bond.buy.less')}
      moreLabel={t('bond.buy.more')}
      digits={maxDigits}
      emptyValue={1}
      invalid={invalid}
    />
  );
}
