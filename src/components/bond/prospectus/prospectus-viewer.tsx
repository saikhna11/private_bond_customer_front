import { FileTextIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { BondType } from '@/queries/bond/type';
import { useBondFileUrl } from '../use-bond-file-url';
import { ProspectusPdf } from './prospectus-pdf';
import { Watermark } from './watermark';

/**
 * A bond's prospectus files, one at a time, to read here only: each is drawn under the
 * reader's watermark, offers no download, and keeps the browser's own menu closed.
 */
export function ProspectusViewer({ bond }: { bond: BondType }) {
  const { t } = useTranslation();
  const files = bond.files.filter((f) => f.kind === 'prospectus');
  const [pickedId, setPickedId] = useState(files[0]?.id);
  const picked = files.find((f) => f.id === pickedId) ?? files[0];
  const { url, data, isPending } = useBondFileUrl(bond.id, picked);

  if (!picked) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('bond.prospectus.title')}</CardTitle>
        <CardDescription>{t('bond.prospectus.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {files.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f) => (
              <Button
                key={f.id}
                type="button"
                size="sm"
                variant={f.id === picked.id ? 'default' : 'outline'}
                className="rounded-lg"
                onClick={() => setPickedId(f.id)}
              >
                <FileTextIcon />
                <span className="max-w-48 truncate">{f.file_name}</span>
              </Button>
            ))}
          </div>
        )}
        <div
          className={cn(
            'max-h-[75vh] overflow-y-auto rounded-xl border bg-muted p-2 select-none [scrollbar-gutter:stable] sm:p-4',
          )}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        >
          {isPending ? (
            <Skeleton className="h-[60vh] w-full" />
          ) : picked.content_type === 'application/pdf' ? (
            <ProspectusPdf key={picked.id} data={data} />
          ) : (
            <div className="relative">
              <img
                src={url}
                alt={picked.file_name}
                draggable={false}
                className="block w-full rounded-md bg-white"
              />
              <Watermark />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
