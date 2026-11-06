import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, CircleAlertIcon, ClockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/components/contract/format';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { issuerBondOptions } from '@/queries/issuer-bond/options';
import { isOpenRequest } from '@/queries/issuer-bond/type';
import { IssuerBondFiles } from './issuer-bond-files';
import { IssuerBondRates } from './issuer-bond-rates';
import { IssuerBondStatus } from './issuer-bond-status';
import { IssuerBondTerms } from './issuer-bond-terms';

/** One of the issuer's bonds: its state, who requested it, its terms, rates and files. */
export function IssuerBondDetail({
  bondId,
  onList,
}: {
  bondId: string;
  onList: () => void;
}) {
  const { t } = useTranslation();
  const { data: b, isPending, error } = useQuery(issuerBondOptions(bondId));

  const back = (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 w-fit text-muted-foreground"
      onClick={onList}
    >
      <ArrowLeftIcon />
      {t('issuer.bonds.toList')}
    </Button>
  );
  if (isPending) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (error || !b) {
    return (
      <div className="flex flex-col gap-4">
        {back}
        <p className="text-sm text-muted-foreground">
          {t('issuer.bonds.notFound')}
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {back}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-muted px-2 py-1 font-mono text-sm font-medium">
          {b.code}
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">{b.name}</h1>
        <IssuerBondStatus b={b} />
      </div>
      {b.requested_at && (
        <p className="text-sm text-muted-foreground">
          {t('issuer.bonds.requested', {
            name: b.requester_name || '-',
            date: formatDateTime(b.requested_at),
          })}
        </p>
      )}
      {isOpenRequest(b) && (
        <Alert>
          <ClockIcon />
          <AlertDescription>{t('issuer.bonds.reviewing')}</AlertDescription>
        </Alert>
      )}
      {b.reject_reason && (
        <Alert
          variant="destructive"
          className="border-destructive/25 bg-destructive/5"
        >
          <CircleAlertIcon />
          <AlertDescription>
            {t('issuer.bonds.rejected', { reason: b.reject_reason })}
          </AlertDescription>
        </Alert>
      )}
      <Card className="py-0">
        <CardContent className="flex flex-col gap-8 p-6">
          <section className="flex flex-col gap-4">
            <h2 className="text-base font-semibold">
              {t('issuer.bonds.form.sections.terms')}
            </h2>
            <IssuerBondTerms b={b} />
          </section>
          <section className="flex flex-col gap-4">
            <h2 className="text-base font-semibold">
              {t('issuer.bonds.form.sections.interest')}
            </h2>
            <IssuerBondRates b={b} />
          </section>
          <section className="flex flex-col gap-4">
            <h2 className="text-base font-semibold">
              {t('issuer.bonds.form.sections.files')}
            </h2>
            <IssuerBondFiles b={b} />
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
