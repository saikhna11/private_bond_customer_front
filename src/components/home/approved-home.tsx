import { Link } from '@tanstack/react-router';
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarClockIcon,
  LandmarkIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ApprovedHome() {
  const { t } = useTranslation();
  const stats = [
    { label: t('home.activeBonds'), value: '0', Icon: LandmarkIcon },
    {
      label: t('home.nextPayment'),
      value: t('home.none'),
      Icon: CalendarClockIcon,
    },
  ];

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="relative overflow-hidden border-0 bg-linear-to-br from-brand-panel to-brand-panel-2 py-0 text-white shadow-lg shadow-brand-panel/20 lg:col-span-2">
          <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent)]" />
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-gold/20 blur-3xl" />
          <CardContent className="relative flex flex-col gap-8 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-white/70">
                {t('home.totalInvestment')}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium ring-1 ring-white/15">
                <BadgeCheckIcon className="size-3.5 text-gold" />
                {t('common.verified')}
              </span>
            </div>
            <div className="space-y-2">
              <p className="tabular text-4xl font-bold tracking-tight sm:text-5xl">
                0 <span className="text-white/60">₮</span>
              </p>
              <p className="max-w-sm text-sm text-white/65">
                {t('home.approvedText')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled
                className="h-10 rounded-xl bg-white px-4 text-brand-panel hover:bg-white/90"
              >
                <LandmarkIcon />
                {t('home.viewBonds')}
                <span className="rounded-full bg-brand-panel/10 px-1.5 text-[10px]">
                  {t('common.soon')}
                </span>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-10 rounded-xl px-4 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/profile">
                  {t('home.myInfo')}
                  <ArrowRightIcon />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {stats.map(({ label, value, Icon }) => (
            <Card key={label} className="py-0">
              <CardContent className="flex h-full flex-row items-center gap-4 p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm text-muted-foreground">
                    {label}
                  </p>
                  <p className="tabular text-xl font-bold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-dashed lg:col-span-2">
          <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <LandmarkIcon className="size-6" />
            </span>
            <p className="font-semibold">{t('home.offersSoon')}</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t('home.offersSoonText')}
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <QuickLink
            to="/profile"
            Icon={UserRoundIcon}
            title={t('nav.profile')}
            text={t('home.profileLink')}
          />
          <QuickLink
            to="/security"
            Icon={ShieldCheckIcon}
            title={t('nav.security')}
            text={t('home.securityLink')}
          />
        </div>
      </div>
    </>
  );
}

function QuickLink({
  to,
  Icon,
  title,
  text,
}: {
  to: '/profile' | '/security';
  Icon: typeof UserRoundIcon;
  title: string;
  text: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:-translate-y-px hover:border-primary/40 hover:shadow-sm motion-reduce:hover:translate-y-0"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {text}
        </span>
      </span>
      <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
