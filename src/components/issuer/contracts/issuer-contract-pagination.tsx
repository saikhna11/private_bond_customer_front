import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

/** Which contracts of the tab the page shows, and the way to the pages around it. */
export function IssuerContractPagination({
  page,
  size,
  total,
  onPage,
}: {
  page: number;
  size: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const { t } = useTranslation();
  const last = Math.max(1, Math.ceil(total / size));
  const from = (page - 1) * size + 1;
  const to = Math.min(total, page * size);

  return (
    <div className="mt-4 flex items-center justify-between gap-3 border-t px-6 pt-4">
      <span className="tabular text-sm text-muted-foreground">
        {from <= to && t('issuer.contracts.pageInfo', { from, to, total })}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          disabled={page <= 1}
          onClick={() => onPage(Math.min(page - 1, last))}
        >
          <ChevronLeftIcon />
          {t('issuer.contracts.prev')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          disabled={page >= last}
          onClick={() => onPage(page + 1)}
        >
          {t('issuer.contracts.next')}
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
