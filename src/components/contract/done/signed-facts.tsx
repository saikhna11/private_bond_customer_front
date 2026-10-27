import { ContractStatusBadge } from '@/components/contract/contract-status-badge';
import {
  contractNumber,
  formatAmount,
  formatDateTime,
} from '@/components/contract/format';
import type { ContractType } from '@/queries/contract/type';

/** A signed contract's number, amount, signing date and status, one tile each. */
export function SignedFacts({ contract }: { contract: ContractType }) {
  const facts = [
    { label: 'Гэрээний дугаар', value: contractNumber(contract) },
    { label: 'Дүн', value: `${formatAmount(contract.principal_amount)} ₮` },
    {
      label: 'Баталгаажсан огноо',
      value: contract.signed_at ? formatDateTime(contract.signed_at) : '-',
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
      {facts.map(({ label, value }) => (
        <div key={label} className="min-w-0 rounded-xl bg-muted/60 px-3 py-2">
          <dt className="truncate text-xs text-muted-foreground">{label}</dt>
          <dd className="tabular truncate font-semibold">{value}</dd>
        </div>
      ))}
      <div className="min-w-0 rounded-xl bg-muted/60 px-3 py-2">
        <dt className="text-xs text-muted-foreground">Төлөв</dt>
        <dd className="mt-0.5">
          <ContractStatusBadge status={contract.status} />
        </dd>
      </div>
    </dl>
  );
}
