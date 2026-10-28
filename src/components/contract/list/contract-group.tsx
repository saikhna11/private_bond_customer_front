import type { ContractSummaryType } from '@/queries/contract/type';
import { ContractListItem } from './contract-list-item';

/**
 * Some of the client's contracts, under title when given, each opening its page; a signed
 * one also downloads its PDF. downloading says a download from the list is under way.
 */
export function ContractGroup({
  title,
  contracts,
  onOpen,
  onDownload,
  downloading,
}: {
  title?: string;
  contracts: ContractSummaryType[];
  onOpen: (contractId: string) => void;
  onDownload: (contract: ContractSummaryType) => void;
  downloading: boolean;
}) {
  return (
    <section>
      {title && (
        <h3 className="px-6 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </h3>
      )}
      <ul className="divide-y">
        {contracts.map((c) => (
          <ContractListItem
            key={c.id}
            contract={c}
            onOpen={() => onOpen(c.id)}
            onDownload={() => onDownload(c)}
            downloading={downloading}
          />
        ))}
      </ul>
    </section>
  );
}
