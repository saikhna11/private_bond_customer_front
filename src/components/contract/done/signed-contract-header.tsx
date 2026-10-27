import { ArrowLeftIcon, DownloadIcon } from 'lucide-react';
import { useDownloadContract } from '@/components/contract/download';
import { Button } from '@/components/ui/button';
import type { ContractType } from '@/queries/contract/type';

/** A signed contract's title, with the way back to the list and its PDF's download. */
export function SignedContractHeader({
  contract,
  onList,
}: {
  contract: ContractType;
  onList: () => void;
}) {
  const download = useDownloadContract();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex justify-between w-full">
        <Button
          variant="outline"
          className="h-10 flex-1 rounded-xl sm:flex-none"
          onClick={onList}
        >
          <ArrowLeftIcon />
          Гэрээнүүд
        </Button>
        <Button
          className="h-10 flex-1 rounded-xl px-6 sm:flex-none"
          onClick={() => download.mutate(contract)}
          disabled={download.isPending}
        >
          <DownloadIcon />
          PDF татах
        </Button>
      </div>
    </div>
  );
}
