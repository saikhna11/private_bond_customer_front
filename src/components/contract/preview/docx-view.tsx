import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { templateFileOptions } from '@/queries/contract/options';
import type { ProductPreviewType } from '@/queries/contract/type';
import { useDocxRender } from './use-docx-render';

/** The previewed contract's document, filled and drawn in the browser (useDocxRender). */
export function DocxView({ preview }: { preview: ProductPreviewType }) {
  const { t } = useTranslation();
  const { data, isPending, error } = useQuery(
    templateFileOptions(preview.template.id),
  );
  const { container, failed } = useDocxRender(data, preview);

  if (isPending) {
    return <Skeleton className="h-[60vh] w-full rounded-xl" />;
  }
  if (error || failed) {
    return (
      <p className="py-10 text-center text-sm text-destructive">
        {error
          ? apiErrorMessage(toApiError(error))
          : t('contract.document.failed')}
      </p>
    );
  }
  return (
    <div
      ref={container}
      className="max-h-[70vh] overflow-y-auto rounded-xl border bg-muted"
    />
  );
}
