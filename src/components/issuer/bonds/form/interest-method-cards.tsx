import { useTranslation } from 'react-i18next';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  type InterestMethod,
  InterestMethodSchema,
} from '@/queries/issuer-bond/type';

/** The ways interest is counted, each a card that says what it does (bond.md 4.5). */
export function InterestMethodCards({
  value,
  onChange,
}: {
  value: InterestMethod;
  onChange: (method: InterestMethod) => void;
}) {
  const { t } = useTranslation();
  return (
    <RadioGroup
      aria-label={t('issuer.bonds.form.method')}
      value={value}
      onValueChange={(v) => onChange(v as InterestMethod)}
      className="flex gap-5"
    >
      {InterestMethodSchema.options.map((m) => (
        <FieldLabel
          key={m}
          htmlFor={`interest_method_${m}`}
          className="cursor-pointer has-data-[state=checked]:border-primary/60 has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10"
        >
          <Field orientation="horizontal">
            <RadioGroupItem value={m} id={`interest_method_${m}`} />
            <FieldContent>
              <FieldTitle>{t(`issuer.bonds.method.${m}`)}</FieldTitle>
              <FieldDescription>
                {t(`issuer.bonds.methodHint.${m}`)}
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}
