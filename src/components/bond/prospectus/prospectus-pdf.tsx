import { useTranslation } from 'react-i18next';
import { usePdfPages } from '@/components/contract/done/use-pdf-pages';
import { Skeleton } from '@/components/ui/skeleton';
import { Watermark } from './watermark';

/** A prospectus PDF drawn page by page, under the reader's watermark. */
export function ProspectusPdf({ data }: { data: ArrayBuffer | undefined }) {
  const { t } = useTranslation();
  const { pages, ready, failed } = usePdfPages(data);

  if (failed) {
    return (
      <p className="py-10 text-center text-sm text-destructive">
        {t('bond.prospectus.failed')}
      </p>
    );
  }
  return (
    <>
      {!ready && <Skeleton className="h-[60vh] w-full" />}
      <div className="relative">
        <div ref={pages} className="flex flex-col gap-3" />
        {ready && <Watermark />}
      </div>
    </>
  );
}
