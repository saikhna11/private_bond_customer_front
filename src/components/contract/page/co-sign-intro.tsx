import { useTranslation } from 'react-i18next';
import { PartyStatuses } from '@/components/contract/done/party-statuses';
import { Card, CardContent } from '@/components/ui/card';
import type { ContractType } from '@/queries/contract/type';

/** What a contract waiting for the client's signature asks of them, and who signed it. */
export function CoSignIntro({ contract }: { contract: ContractType }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <p className="max-w-md text-sm text-muted-foreground">
          {t('contract.coSignIntro')}
        </p>
        <PartyStatuses contract={contract} />
      </CardContent>
    </Card>
  );
}
