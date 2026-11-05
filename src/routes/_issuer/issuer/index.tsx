import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/page-title';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { issuerMeOptions } from '@/queries/issuer/options';
import type { IssuerBankAccountType } from '@/queries/issuer/type';

export const Route = createFileRoute('/_issuer/issuer/')({
  component: IssuerHome,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-all sm:text-right">{value}</dd>
    </div>
  );
}

function bankVariant(status: IssuerBankAccountType['status']) {
  if (status === 'verified') return 'default';
  if (status === 'unverified') return 'secondary';
  return 'destructive';
}

function IssuerHome() {
  const { t } = useTranslation();
  const { data } = useSuspenseQuery(issuerMeOptions());
  const { member, issuer } = data;

  return (
    <>
      <PageTitle
        title={issuer.name}
        description={`${t('issuer.title')} · ${t('common.registerNumber')} ${issuer.register_number}`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('issuer.company')}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-3">
              <Row label={t('issuer.companyName')} value={issuer.name} />
              <Row
                label={t('common.registerNumber')}
                value={issuer.register_number}
              />
              <Row
                label={t('issuer.stateRegisterNumber')}
                value={issuer.state_register_number}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('issuer.bankAccounts')}</CardTitle>
            <CardDescription>{t('issuer.bankAccountsText')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {issuer.bank_accounts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {t('issuer.noBankAccounts')}
              </p>
            )}
            {issuer.bank_accounts.map((a) => (
              <div key={a.currency} className="rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="font-semibold">
                    {a.bank_name} · {a.currency}
                  </span>
                  <Badge variant={bankVariant(a.status)}>
                    {t(`issuer.bankStatus.${a.status}`)}
                  </Badge>
                </div>
                <dl className="flex flex-col gap-2">
                  <Row label={t('issuer.accountName')} value={a.account_name} />
                  <Row
                    label={t('issuer.accountNumber')}
                    value={a.account_number}
                  />
                  <Row label="IBAN" value={a.iban} />
                </dl>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('issuer.members')}</CardTitle>
          <CardDescription>{t('issuer.membersText')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {issuer.members.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {m.last_name} {m.first_name}
                    {m.id === member.id && (
                      <span className="ml-1 text-muted-foreground">
                        ({t('issuer.you')})
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[m.position, m.email, m.phone].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {!m.is_active && (
                    <Badge variant="destructive">{t('issuer.blocked')}</Badge>
                  )}
                  <Badge
                    variant={m.role === 'director' ? 'default' : 'outline'}
                  >
                    {t(`issuer.role.${m.role}`)}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
