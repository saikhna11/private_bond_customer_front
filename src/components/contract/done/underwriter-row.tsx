import { CircleCheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { UnderwriterType } from '@/queries/contract/type';

/** The underwriter beside the parties who sign: the contract holds its signature from the start. */
export function UnderwriterRow({
  underwriter,
}: {
  underwriter: UnderwriterType;
}) {
  const { t } = useTranslation();
  return (
    <li className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">
          {t('contract.party.underwriter')}
        </span>
        <span className="block truncate font-medium">{underwriter.name}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-success">
        <CircleCheckIcon className="size-3.5" />
        {t('contract.partyState.signed')}
      </span>
    </li>
  );
}
