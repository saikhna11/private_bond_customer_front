import { MessageSquareQuoteIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

/** Why the bond issuer's director declined the contract, as they wrote it. */
export function DeclineReason({
  reason,
  className,
}: {
  reason: string;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'flex w-full max-w-md items-start gap-3 rounded-xl border bg-muted/40 px-3 py-2 text-left text-sm',
        className,
      )}
    >
      <MessageSquareQuoteIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {t('contract.declineReason')}
        </p>
        <p className="whitespace-pre-line break-words">{reason}</p>
      </div>
    </div>
  );
}
