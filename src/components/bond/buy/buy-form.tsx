import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/common/form-field';
import { Card, CardContent } from '@/components/ui/card';
import type { BondType } from '@/queries/bond/type';
import { AmountField } from './amount-field';
import { CoHolderFields } from './co-holder-fields';
import { OptionPicker } from './option-picker';
import { OwnershipPicker } from './ownership-picker';
import { QuoteCard } from './quote-card';
import { TermSelect } from './term-select';
import { usePurchaseForm } from './use-purchase-form';

/**
 * Buying a bond: the option, the term, the amount and who holds it on the left; what the
 * purchase would be, checked by the backend, and the payment on the right.
 */
export function BuyForm({ bond }: { bond: BondType }) {
  const { t } = useTranslation();
  const form = usePurchaseForm(bond);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      <Card>
        <CardContent className="flex flex-col gap-5">
          <FormField id="option" label={t('bond.buy.option')}>
            <OptionPicker
              options={bond.rate_options}
              value={form.option?.id ?? ''}
              onChange={form.pickOption}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="term" label={t('bond.term')}>
              <TermSelect
                id="term"
                terms={form.terms}
                value={form.term}
                onChange={form.setTerm}
              />
            </FormField>
            <FormField
              id="amount"
              label={t('bond.buy.amount')}
              error={form.errors.amount}
            >
              <AmountField
                id="amount"
                bond={bond}
                value={form.amount}
                onChange={form.setAmount}
                invalid={!!form.errors.amount}
              />
            </FormField>
          </div>
          {form.ownerships.length > 1 && (
            <FormField id="ownership" label={t('bond.buy.ownership')}>
              <OwnershipPicker
                options={form.ownerships}
                value={form.ownership}
                onChange={form.setOwnership}
              />
            </FormField>
          )}
          {form.ownership === 'joint' && <CoHolderFields form={form} />}
        </CardContent>
      </Card>
      <QuoteCard bond={bond} body={form.body} />
    </div>
  );
}
