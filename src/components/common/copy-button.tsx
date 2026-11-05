import { CopyIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/use-copy';

/** A small button that copies value to the clipboard. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const { t } = useTranslation();
  const copy = useCopy();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8 shrink-0 rounded-lg text-muted-foreground"
      aria-label={`${t('contract.payment.copy')}: ${label}`}
      onClick={() => void copy(value)}
    >
      <CopyIcon />
    </Button>
  );
}
