import { FileIcon, ImageIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/utils';
import {
  MAX_BOND_FILE_BYTES,
  MAX_PROSPECTUS_FILES,
} from '@/queries/issuer-bond/type';
import { FilePickButton } from './file-pick-button';
import { FormSection } from './form-section';

/** The files a request sends after its terms: up to five prospectus files and one cover. */
export interface RequestFiles {
  prospectus: File[];
  cover: File | null;
}

/** Picks the request's files; they upload once the request is sent. */
export function RequestFilesFields({
  files,
  onChange,
}: {
  files: RequestFiles;
  onChange: (files: RequestFiles) => void;
}) {
  const { t } = useTranslation();
  const fits = (file: File) => {
    if (file.size > MAX_BOND_FILE_BYTES) {
      showToast('error', t('issuer.bonds.files.tooLarge'));
      return false;
    }
    return true;
  };
  const row = (file: File, image: boolean, onRemove: () => void) => (
    <li
      key={`${file.name}-${file.size}`}
      className="flex items-center gap-3 px-3 py-2 text-sm"
    >
      {image ? (
        <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
      ) : (
        <FileIcon className="size-4 shrink-0 text-muted-foreground" />
      )}
      <span className="min-w-0 flex-1 truncate">{file.name}</span>
      <span className="tabular-nums shrink-0 text-xs text-muted-foreground">
        {(file.size / 1024 / 1024).toFixed(1)} MB
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7"
        aria-label={t('issuer.bonds.files.remove')}
        onClick={onRemove}
      >
        <XIcon />
      </Button>
    </li>
  );

  return (
    <FormSection title={t('issuer.bonds.form.sections.files')}>
      <p className="text-sm text-muted-foreground">
        {t('issuer.bonds.files.hint')}
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">
            {t('issuer.bonds.files.prospectus')} ({files.prospectus.length}/
            {MAX_PROSPECTUS_FILES})
          </span>
          <FilePickButton
            kind="prospectus"
            label={t('issuer.bonds.files.add')}
            disabled={files.prospectus.length >= MAX_PROSPECTUS_FILES}
            onPick={(f) =>
              fits(f) &&
              onChange({ ...files, prospectus: [...files.prospectus, f] })
            }
          />
        </div>
        {files.prospectus.length > 0 && (
          <ul className="divide-y rounded-lg border">
            {files.prospectus.map((f, i) =>
              row(f, f.type.startsWith('image/'), () =>
                onChange({
                  ...files,
                  prospectus: files.prospectus.filter((_, j) => j !== i),
                }),
              ),
            )}
          </ul>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">
            {t('issuer.bonds.files.cover')}{' '}
            <span className="font-normal text-muted-foreground">
              {t('common.optional')}
            </span>
          </span>
          <FilePickButton
            kind="cover"
            label={
              files.cover
                ? t('issuer.bonds.files.replaceCover')
                : t('issuer.bonds.files.addCover')
            }
            onPick={(f) => fits(f) && onChange({ ...files, cover: f })}
          />
        </div>
        {files.cover && (
          <ul className="divide-y rounded-lg border">
            {row(files.cover, true, () => onChange({ ...files, cover: null }))}
          </ul>
        )}
      </div>
    </FormSection>
  );
}
