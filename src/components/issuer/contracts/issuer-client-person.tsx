import { useTranslation } from 'react-i18next';
import type { PartyType } from '@/queries/contract/type';
import { IssuerFact } from './issuer-fact';
import { personName } from './person-name';

/** A client party of the contract: who they are in it, their names, number and phone. */
export function IssuerClientPerson({ party }: { party: PartyType }) {
  const { t } = useTranslation();
  const role = party.type === 'co_holder' ? 'co_holder' : 'holder';
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        {t(`issuer.contracts.client.${role}`)}
      </h3>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <IssuerFact
          label={t('issuer.contracts.client.name')}
          value={personName(party)}
          className="sm:col-span-2"
        />
        <IssuerFact
          label={t('issuer.contracts.client.registerNo')}
          value={party.register_no}
        />
        <IssuerFact
          label={t('issuer.contracts.client.phone')}
          value={party.phone ?? ''}
        />
      </dl>
    </section>
  );
}
