import { Loader2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCountdown } from '@/hooks/use-countdown';
import type { PaymentType } from '@/queries/contract/type';
import { formatDateTime, formatMoney } from '../format';

/** Seconds as h:mm:ss. */
function clock(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Where the payment stands: the deadline and the time left, that it is being checked, and
 * what came so far when a payment came short.
 */
export function PaymentProgress({ payment }: { payment: PaymentType }) {
  const { t } = useTranslation();
  const left = useCountdown(Date.parse(payment.deadline));
  const received = Number(payment.received);
  const short = Number(payment.amount) - received;
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-muted/60 px-3 py-2">
        <div className="text-xs text-muted-foreground">
          {t('contract.payment.deadline')}
        </div>
        <div className="tabular font-medium">
          {formatDateTime(payment.deadline)}
        </div>
        <div className="tabular text-sm text-primary">
          {t('contract.payment.left', { time: clock(left) })}
        </div>
      </div>
      {received > 0 && (
        <div className="rounded-xl bg-warning/10 px-3 py-2 text-sm">
          <div className="font-medium">
            {t('contract.payment.received', {
              received: formatMoney(payment.received, payment.currency),
            })}
          </div>
          <div className="text-muted-foreground">
            {t('contract.payment.short', {
              left: formatMoney(String(short), payment.currency),
            })}
          </div>
        </div>
      )}
      <div className="flex items-start gap-3 rounded-xl border px-3 py-3">
        <Loader2Icon className="mt-0.5 size-4 shrink-0 animate-spin text-primary motion-reduce:animate-none" />
        <div className="text-sm">
          <div className="font-medium">{t('contract.payment.waiting')}</div>
          <div className="text-muted-foreground">
            {t('contract.payment.waitingText')}
          </div>
        </div>
      </div>
    </div>
  );
}
