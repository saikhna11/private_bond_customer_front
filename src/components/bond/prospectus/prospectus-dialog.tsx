import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { BondFileType } from '@/queries/bond/type';
import { ProspectusFileView } from './prospectus-file-view';

/**
 * The prospectus file openId names, read in a window over the page, with the way to the
 * bond's other files; closed when openId is undefined.
 */
export function ProspectusDialog({
  bondId,
  files,
  openId,
  onOpen,
}: {
  bondId: string;
  files: BondFileType[];
  openId: string | undefined;
  onOpen: (fileId: string | undefined) => void;
}) {
  const { t } = useTranslation();
  const index = files.findIndex((f) => f.id === openId);
  const file = files[index];

  return (
    <Dialog
      open={!!file}
      onOpenChange={(open) => {
        if (!open) onOpen(undefined);
      }}
    >
      <DialogContent className="flex h-[92vh] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <div className="flex items-center gap-3 border-b py-3 pr-14 pl-4 sm:pl-5">
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate text-base">
              {file?.file_name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t('bond.prospectus.readOnly')}
            </DialogDescription>
          </div>
          {files.length > 1 && (
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t('bond.prospectus.prev')}
                disabled={index <= 0}
                onClick={() => onOpen(files[index - 1]?.id)}
              >
                <ChevronLeftIcon />
              </Button>
              <span className="tabular min-w-12 text-center text-xs text-muted-foreground">
                {t('bond.prospectus.counter', {
                  n: index + 1,
                  total: files.length,
                })}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t('bond.prospectus.next')}
                disabled={index >= files.length - 1}
                onClick={() => onOpen(files[index + 1]?.id)}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-muted p-2 [scrollbar-gutter:stable] sm:p-4">
          {file && (
            <ProspectusFileView key={file.id} bondId={bondId} file={file} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
