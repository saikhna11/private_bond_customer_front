import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import type { BondFileType } from '@/queries/bond/type';
import { useBondFileUrl } from '../use-bond-file-url';
import { ProspectusPdf } from './prospectus-pdf';
import { Watermark } from './watermark';

/**
 * One prospectus file, to read here only (bond.md 3.5): a PDF drawn page by page, or a
 * picture, under the reader's watermark, with no download and the browser's own menu and
 * dragging kept closed.
 */
export function ProspectusFileView({
  bondId,
  file,
}: {
  bondId: string;
  file: BondFileType;
}) {
  const { t } = useTranslation();
  const { url, data, isPending, error } = useBondFileUrl(bondId, file);

  return (
    <div
      className="select-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {isPending ? (
        <Skeleton className="h-[70vh] w-full" />
      ) : error ? (
        <p className="py-10 text-center text-sm text-destructive">
          {t('bond.prospectus.failed')}
        </p>
      ) : file.content_type === 'application/pdf' ? (
        <ProspectusPdf data={data} />
      ) : (
        <div className="relative">
          <img
            src={url}
            alt={file.file_name}
            draggable={false}
            className="block w-full rounded-md bg-white"
          />
          <Watermark />
        </div>
      )}
    </div>
  );
}
