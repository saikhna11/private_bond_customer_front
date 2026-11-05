import { useTranslation } from 'react-i18next';
import type { ContractType } from '@/queries/contract/type';
import { IssuerFact } from './issuer-fact';

/** The account the bond repays the contract's holder to, as the contract was bought. */
export function IssuerRepaymentAccount({
  contract,
}: {
  contract: ContractType;
}) {
  const { t } = useTranslation();
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        {t('issuer.contracts.client.account')}
      </h3>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <IssuerFact
          label={t('issuer.contracts.client.bank')}
          value={contract.repayment_bank_name}
        />
        <IssuerFact
          label={t('issuer.contracts.client.accountNo')}
          value={contract.repayment_account_no}
        />
        <IssuerFact
          label={t('issuer.contracts.client.iban')}
          value={contract.repayment_iban}
          className="sm:col-span-2"
        />
        <IssuerFact
          label={t('issuer.contracts.client.owner')}
          value={contract.repayment_owner}
          className="sm:col-span-2"
        />
      </dl>
    </section>
  );
}
