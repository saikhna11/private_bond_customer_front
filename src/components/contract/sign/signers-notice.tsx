import { InfoIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { partyLabel, partyName } from '@/components/contract/format';
import { Card, CardContent } from '@/components/ui/card';
import type { PreviewPartyType } from '@/queries/contract/type';

/** The parties who still sign, each from their own account, and the deadline for all. */
export function SignersNotice({ others }: { others: PreviewPartyType[] }) {
  const { t } = useTranslation();
  const names = others
    .map((p) => `${partyLabel(p.type)} ${partyName(p)}`)
    .join(', ');
  return (
    <Card className="border-dashed py-0">
      <CardContent className="flex-row items-start gap-3 p-5 text-sm">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="space-y-1">
          <p>{t('contract.sign.others', { names })}</p>
          <p className="text-muted-foreground">{t('contract.sign.deadline')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
