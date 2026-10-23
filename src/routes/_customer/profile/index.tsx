import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { CircleCheckIcon, MailIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/page-title';
import { StatusBadge } from '@/components/common/status-badge';
import { ChangeEmailDialog } from '@/components/profile/change-email-dialog';
import { ChangePasswordForm } from '@/components/profile/change-password-form';
import { OfficersCard } from '@/components/profile/officers-card';
import { ProfileDetailsForm } from '@/components/profile/profile-details-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { editsProfile, initials, isIndividual } from '@/lib/client';
import { formatDate } from '@/lib/format';
import { meOptions } from '@/queries/auth/options';
import { displayName } from '@/queries/auth/type';

export const Route = createFileRoute('/_customer/profile/')({
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useTranslation();
  const { data: me } = useSuspenseQuery(meOptions());
  const individual = isIndividual(me);
  const editable = editsProfile(me);

  return (
    <>
      <PageTitle
        title={t('nav.profile')}
        description={t('profile.description')}
      />

      <Card className="overflow-hidden py-0">
        <div className="h-20 bg-linear-to-r from-brand-panel to-brand-panel-2" />
        <CardContent className="-mt-10 flex flex-col gap-4 pb-6 sm:flex-row sm:items-end">
          <Avatar className="size-20 ring-4 ring-card">
            <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
              {initials(me)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              {displayName(me)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(`clientType.${me.type}`)}
              {me.org_name && ` · ${me.org_name}`}
              {' · '}
              {t('profile.memberSince', { date: formatDate(me.created_at) })}
            </p>
          </div>
          <StatusBadge status={me.status} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.basicInfo')}</CardTitle>
              <CardDescription>
                {me.status === 'approved'
                  ? me.type === 'customer'
                    ? t('profile.lockedCustomer')
                    : t('profile.lockedOther')
                  : me.status === 'rejected'
                    ? t('home.resubmitHint')
                    : t('profile.reviewHint')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editable ? (
                <ProfileDetailsForm me={me} />
              ) : (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Info label={t('common.name')} value={displayName(me)} />
                  <Info
                    label={t('common.registerNumber')}
                    value={me.register_number}
                  />
                  <Info label={t('common.phone')} value={me.phone} />
                  {me.position && (
                    <Info label={t('profile.position')} value={me.position} />
                  )}
                </dl>
              )}
            </CardContent>
          </Card>

          {me.type === 'organization' && <OfficersCard me={me} />}
        </div>

        <div className="flex flex-col gap-6">
          {individual && (
            <Card>
              <CardHeader>
                <CardTitle>{t('common.email')}</CardTitle>
                <CardDescription>{t('profile.emailText')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-row items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <MailIcon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{me.email}</p>
                  {me.email_verified && (
                    <p className="flex items-center gap-1 text-xs text-success">
                      <CircleCheckIcon className="size-3" />
                      {t('common.verified')}
                    </p>
                  )}
                </div>
                <ChangeEmailDialog current={me.email} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t('profile.changePassword')}</CardTitle>
              <CardDescription>
                {t('profile.changePasswordText')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value || t('common.notSet')}</dd>
    </div>
  );
}
