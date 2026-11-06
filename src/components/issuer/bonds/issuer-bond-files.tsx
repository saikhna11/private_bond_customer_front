import { DownloadIcon, FileIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { downloadIssuerBondFile } from '@/queries/issuer-bond/query';
import type { IssuerBondDetailType } from '@/queries/issuer-bond/type';

/** A bond's files as the request sent them, each downloadable; they never change after. */
export function IssuerBondFiles({ b }: { b: IssuerBondDetailType }) {
  const { t } = useTranslation();
  const prospectus = b.files.filter((f) => f.kind === 'prospectus');
  const cover = b.files.find((f) => f.kind === 'cover');

  const download = async (id: string, name: string) => {
    try {
      const data = await downloadIssuerBondFile(b.id, id);
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast('error', apiErrorMessage(toApiError(err)));
    }
  };

  if (b.files.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t('issuer.bonds.files.none')}
      </p>
    );
  }
  return (
    <ul className="divide-y rounded-lg border">
      {[...prospectus, ...(cover ? [cover] : [])].map((f) => (
        <li key={f.id} className="flex items-center gap-3 px-3 py-2 text-sm">
          <FileIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate">{f.file_name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {t(
              f.kind === 'cover'
                ? 'issuer.bonds.files.cover'
                : 'issuer.bonds.files.prospectus',
            )}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label={t('issuer.bonds.files.download')}
            onClick={() => void download(f.id, f.file_name)}
          >
            <DownloadIcon />
          </Button>
        </li>
      ))}
    </ul>
  );
}
