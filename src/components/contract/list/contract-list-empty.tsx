import { FileTextIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/** The contract list before the reader's first contract; text says what to do then. */
export function ContractListEmpty({ text }: { text?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <FileTextIcon className="size-6" />
      </span>
      <p className="font-semibold">{t('contract.list.emptyTitle')}</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {text ?? t('contract.list.emptyText')}
      </p>
    </div>
  );
}
