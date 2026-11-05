import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { mockCases, type useMockTransfer } from './use-mock-transfer';

/** The test transfer's case, amount and description, editable. */
export function MockTransferFields({
  transfer,
}: {
  transfer: ReturnType<typeof useMockTransfer>;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-1.5">
        {mockCases.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={transfer.mockCase === c}
            onClick={() => transfer.pick(c)}
            className={cn(
              'h-9 rounded-lg border text-sm font-medium transition-colors hover:bg-muted/60',
              transfer.mockCase === c &&
                'border-primary bg-primary/5 text-primary ring-2 ring-primary/15 hover:bg-primary/5',
            )}
          >
            {t(`contract.payment.mockCase.${c}`)}
          </button>
        ))}
      </div>
      <div className="space-y-1">
        <Label htmlFor="mock-amount" className="text-xs text-muted-foreground">
          {t('contract.payment.mockAmount')}
        </Label>
        <Input
          id="mock-amount"
          inputMode="numeric"
          className="tabular h-10 rounded-xl"
          value={transfer.amount}
          onChange={(e) => transfer.setAmount(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label
          htmlFor="mock-reference"
          className="text-xs text-muted-foreground"
        >
          {t('contract.payment.mockReference')}
        </Label>
        <Input
          id="mock-reference"
          className="h-10 rounded-xl"
          maxLength={100}
          value={transfer.reference}
          onChange={(e) => transfer.setReference(e.target.value)}
        />
      </div>
    </div>
  );
}
