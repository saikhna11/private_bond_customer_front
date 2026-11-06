import { useSuspenseQuery } from '@tanstack/react-query';
import { Building2Icon, ShieldCheckIcon, UsersIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/components/contract/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContractType, PartyType } from '@/queries/contract/type';
import { issuerMeOptions } from '@/queries/issuer/options';
import { IssuerPartyBlock, type PartyTone } from './issuer-party-block';
import { personName } from './person-name';

/**
 * The contract's three parties: its client, holder and any co-holder, who signed first; its
 * bond issuer, in the name of its chief executive, who signs last (while it awaits them,
 * whoever holds the office now); and the underwriter, signed from the start.
 */
export function IssuerContractParties({
  contract,
}: {
  contract: ContractType;
}) {
  const { t } = useTranslation();
  const { data: me } = useSuspenseQuery(issuerMeOptions());
  const holder = contract.parties.find((p) => p.type === 'holder');
  const coHolder = contract.parties.find((p) => p.type === 'co_holder');
  const issuer = contract.parties.find((p) => p.type === 'issuer');
  const pending = contract.status === 'pending_issuer_signature';
  const director = pending
    ? me.issuer.members.find((m) => m.role === 'director')
    : undefined;
  const issuerState = (p?: PartyType): [string, PartyTone] => {
    if (p?.signed_at) {
      return [t('issuer.contracts.parties.signed'), 'done'];
    }
    if (p?.declined_at) {
      return [t('issuer.contracts.parties.declined'), 'declined'];
    }
    return pending
      ? [t('issuer.contracts.parties.awaited'), 'awaited']
      : [t('issuer.contracts.parties.unsigned'), 'none'];
  };
  const [state, tone] = issuerState(issuer);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('issuer.contracts.parties.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y rounded-xl border text-sm">
          <IssuerPartyBlock
            Icon={UsersIcon}
            label={t('issuer.contracts.parties.client')}
            name={holder ? personName(holder) : '-'}
            lines={
              coHolder
                ? [
                    t('issuer.contracts.withCoHolder', {
                      name: personName(coHolder),
                    }),
                  ]
                : []
            }
            state={t('issuer.contracts.parties.signed')}
            tone="done"
          />
          <IssuerPartyBlock
            Icon={Building2Icon}
            label={t('issuer.contracts.parties.issuer')}
            name={issuer?.organization_name ?? me.issuer.name}
            lines={[
              t('issuer.contracts.parties.director', {
                name: personName(director ?? issuer ?? {}) || '-',
              }),
              ...(issuer?.signed_at
                ? [formatDateTime(issuer.signed_at)]
                : issuer?.declined_at
                  ? [formatDateTime(issuer.declined_at)]
                  : []),
            ]}
            state={state}
            tone={tone}
          />
          <IssuerPartyBlock
            Icon={ShieldCheckIcon}
            label={t('issuer.contracts.parties.underwriter')}
            name={contract.underwriter.name}
            lines={[
              t('issuer.contracts.parties.director', {
                name: personName({
                  last_name: contract.underwriter.director_last_name,
                  first_name: contract.underwriter.director_first_name,
                }),
              }),
            ]}
            state={t('issuer.contracts.parties.signed')}
            tone="done"
          />
        </ul>
      </CardContent>
    </Card>
  );
}
