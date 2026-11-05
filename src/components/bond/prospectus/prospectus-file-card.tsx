import { ChevronRightIcon, FileTextIcon, ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BondFileType } from '@/queries/bond/type';
import { formatFileSize } from '../format';

/** A prospectus file as a card: its kind, name and size, opening it to read. */
export function ProspectusFileCard({
  file,
  onOpen,
}: {
  file: BondFileType;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const pdf = file.content_type === 'application/pdf';
  const Icon = pdf ? FileTextIcon : ImageIcon;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full min-w-0 items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {file.file_name}
        </span>
        <span className="tabular block text-xs text-muted-foreground">
          {t(pdf ? 'bond.prospectus.pdf' : 'bond.prospectus.image')} ·{' '}
          {formatFileSize(file.size_bytes)}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
        <span className="hidden sm:inline">{t('bond.prospectus.view')}</span>
        <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}
