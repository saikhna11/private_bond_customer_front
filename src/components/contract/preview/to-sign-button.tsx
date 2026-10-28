import { PenLineIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

/** Moves on from reading the contract to signing it. */
export function ToSignButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <Button className="h-10 rounded-xl px-6" onClick={onClick}>
      <PenLineIcon />
      {t('contract.toSign')}
    </Button>
  );
}
