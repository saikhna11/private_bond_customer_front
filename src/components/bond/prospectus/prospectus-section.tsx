// import { LockIcon } from "lucide-react";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BondType } from '@/queries/bond/type';
import { ProspectusDialog } from './prospectus-dialog';
import { ProspectusFileCard } from './prospectus-file-card';

/**
 * A bond's prospectus: its text, and its files as cards that open in a window to read
 * (bond.md 3.5: read here only, under the reader's watermark, with no download or print).
 * Nothing when the bond has neither.
 */
export function ProspectusSection({ bond }: { bond: BondType }) {
  const { t } = useTranslation();
  const files = bond.files.filter((f) => f.kind === 'prospectus');
  const [openId, setOpenId] = useState<string>();

  if (!bond.prospectus && files.length === 0) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('bond.about')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {bond.prospectus && (
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {bond.prospectus}
          </p>
        )}
        {files.length > 0 && (
          <section className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">
                {t('bond.prospectus.title')}
              </h3>
              {/* <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <LockIcon className="mt-0.5 size-3.5 shrink-0" />
                {t("bond.prospectus.description")}
              </p> */}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {files.map((f) => (
                <ProspectusFileCard
                  key={f.id}
                  file={f}
                  onOpen={() => setOpenId(f.id)}
                />
              ))}
            </div>
          </section>
        )}
        <ProspectusDialog
          bondId={bond.id}
          files={files}
          openId={openId}
          onOpen={setOpenId}
        />
      </CardContent>
    </Card>
  );
}
