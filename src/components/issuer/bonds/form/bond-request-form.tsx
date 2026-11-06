import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { applyFieldErrors } from '@/lib/form-errors';
import { showToast } from '@/lib/utils';
import { issuerBondKeys } from '@/queries/issuer-bond/options';
import {
  fileToBase64,
  requestBond,
  uploadIssuerBondFile,
} from '@/queries/issuer-bond/query';
import type { BondFileKind } from '@/queries/issuer-bond/type';
import { AmountFields } from './amount-fields';
import { ExtraFields } from './extra-fields';
import { GeneralFields } from './general-fields';
import { InterestFields } from './interest-fields';
import { type RequestFiles, RequestFilesFields } from './request-files-fields';
import { SaleFields } from './sale-fields';
import {
  type BondRequestValues,
  requestBody,
  requestFieldNames,
  useBondRequestForm,
} from './use-bond-request-form';

/**
 * A new bond request: its terms, rate matrix and files. Sending creates the request, then
 * uploads its files one by one; a file that fails can be added again on the request's page
 * until staff decide it.
 */
export function BondRequestForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useBondRequestForm();
  const [files, setFiles] = useState<RequestFiles>({
    prospectus: [],
    cover: null,
  });
  const [error, setError] = useState<ApiError | null>(null);

  async function submit(v: BondRequestValues) {
    setError(null);
    let id: string;
    try {
      id = (await requestBond(requestBody(v))).id;
    } catch (err) {
      const e = toApiError(err);
      if (!applyFieldErrors(e, form.setError, requestFieldNames)) setError(e);
      return;
    }
    const uploads: [BondFileKind, File][] = [
      ...files.prospectus.map((f): [BondFileKind, File] => ['prospectus', f]),
      ...(files.cover ? [['cover', files.cover] as [BondFileKind, File]] : []),
    ];
    let failed = 0;
    for (const [kind, file] of uploads) {
      try {
        const content = await fileToBase64(file);
        await uploadIssuerBondFile(id, { kind, file_name: file.name, content });
      } catch {
        failed++;
      }
    }
    if (failed > 0) {
      showToast(
        'warning',
        t('issuer.bonds.form.filesFailed', { count: failed }),
        10000,
      );
    } else {
      showToast('success', t('issuer.bonds.form.sent'));
    }
    await queryClient.invalidateQueries({ queryKey: issuerBondKeys.all });
    await navigate({ to: '/issuer/bonds', search: { bondId: id } });
  }

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <Card className="py-0">
        <CardContent className="p-6">
          <div className="flex flex-col divide-y divide-border">
            <GeneralFields form={form} />
            <AmountFields form={form} />
            <InterestFields form={form} />
            <SaleFields form={form} />
            <ExtraFields form={form} />
            <RequestFilesFields files={files} onChange={setFiles} />
          </div>
        </CardContent>
      </Card>
      {/* The error sits in the bar, so it shows wherever the form is scrolled. */}
      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur supports-backdrop-filter:bg-card/80">
        <ApiErrorAlert error={error} />
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {t('issuer.bonds.form.footer')}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" asChild>
              <Link to="/issuer/bonds">{t('common.cancel')}</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2Icon className="animate-spin" />
              )}
              {t('issuer.bonds.form.submit')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
