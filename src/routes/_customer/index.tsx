import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { CircleXIcon, PencilIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '@/components/common/status-badge';
import { ApprovedHome } from '@/components/home/approved-home';
import { KycSteps } from '@/components/home/kyc-steps';
import { OrgChecklist } from '@/components/home/org-checklist';
import { PendingCard } from '@/components/home/pending-card';
import { OfficersCard } from '@/components/profile/officers-card';
import { ProfileDetailsForm } from '@/components/profile/profile-details-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { editsProfile } from '@/lib/client';
import { meOptions } from '@/queries/auth/options';
import { displayName } from '@/queries/auth/type';

export const Route = createFileRoute('/_customer/')({
  component: CustomerHome,
});

function greeting(): 'night' | 'morning' | 'afternoon' | 'evening' {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Ulaanbaatar',
      hour: 'numeric',
      hour12: false,
    }).format(new Date()),
  );
  if (hour < 5) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function CustomerHome() {
  const { t } = useTranslation();
  const { data: me } = useSuspenseQuery(meOptions());
  const needsProfile = editsProfile(me) && !me.profile_complete;
  const organization = me.type === 'organization';
  const name = organization
    ? displayName(me)
    : (me.first_name ?? displayName(me));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {t(`home.greeting.${greeting()}`)},
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {name}
          </h1>
        </div>
        <StatusBadge status={me.status} />
      </div>

      {me.status === 'approved' ? (
        <ApprovedHome />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{t('home.progressTitle')}</CardTitle>
              <CardDescription>{t('home.progressText')}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <KycSteps me={me} />
            </CardContent>
          </Card>

          {me.status === 'rejected' && (
            <Card className="border-destructive/30 bg-destructive/4">
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <CircleXIcon className="size-5" />
                </span>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{t('home.rejectedTitle')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('home.reason')}{' '}
                    <span className="text-foreground">
                      {me.reject_reason || t('common.unknown')}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('home.resubmitHint')}
                  </p>
                </div>
                {editsProfile(me) && (
                  <Button asChild variant="outline">
                    <Link to="/profile">
                      <PencilIcon />
                      {t('home.editInfo')}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {needsProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('home.completeTitle')}
                </CardTitle>
                <CardDescription>
                  {organization
                    ? t('home.orgCompleteText')
                    : t('home.completeText')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {/* An organization goes to review once the signer's position is in too. */}
                {organization && <OrgChecklist me={me} />}
                <ProfileDetailsForm
                  me={me}
                  submitLabel={
                    organization ? undefined : t('home.submitForReview')
                  }
                />
              </CardContent>
            </Card>
          )}

          {needsProfile && organization && <OfficersCard me={me} />}

          {me.status === 'pending' && !needsProfile && <PendingCard />}
        </>
      )}
    </>
  );
}
