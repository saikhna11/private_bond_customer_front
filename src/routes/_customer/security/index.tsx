import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  LaptopIcon,
  LogOutIcon,
  MonitorSmartphoneIcon,
  SmartphoneIcon,
  Trash2Icon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { PageTitle } from '@/components/common/page-title';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLogout } from '@/hooks/use-logout';
import { toApiError } from '@/lib/fetcher';
import { formatDateTime } from '@/lib/format';
import { apiErrorMessage } from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { sessionKeys, sessionsOptions } from '@/queries/session/options';
import {
  endOtherSessions,
  endSession,
  forgetDevice,
} from '@/queries/session/query';
import type { SessionType } from '@/queries/session/type';

export const Route = createFileRoute('/_customer/security/')({
  component: SecurityPage,
});

function SecurityPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: sessions, isPending, error } = useQuery(sessionsOptions());
  const others = sessions?.filter((s) => !s.current) ?? [];
  const current = sessions?.find((s) => s.current);

  async function run(action: () => Promise<unknown>, done: string) {
    try {
      await action();
      showToast('success', done);
    } catch (err) {
      showToast('error', apiErrorMessage(toApiError(err)));
    } finally {
      await queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    }
  }

  return (
    <>
      <PageTitle
        title={t('nav.security')}
        description={t('security.description')}
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>{t('security.activeSessions')}</CardTitle>
            <CardDescription>
              {sessions
                ? t('security.sessionCount', { count: sessions.length })
                : t('security.loading')}
            </CardDescription>
          </div>
          {others.length > 0 && (
            <ConfirmDialog
              trigger={
                <Button variant="outline" size="sm" className="shrink-0">
                  <LogOutIcon />
                  <span className="hidden sm:inline">
                    {t('security.signOutOthers')}
                  </span>
                </Button>
              }
              title={t('security.othersTitle')}
              description={t('security.othersText')}
              confirmLabel={t('common.logout')}
              onConfirm={() =>
                run(async () => {
                  const res = await endOtherSessions();
                  return res.ended;
                }, t('security.othersDone'))
              }
            />
          )}
        </CardHeader>
        <CardContent className="px-0">
          {isPending ? (
            <div className="space-y-3 px-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : error ? (
            <p className="px-6 text-sm text-destructive">
              {apiErrorMessage(toApiError(error))}
            </p>
          ) : (
            <ul className="divide-y">
              {current && <SessionRow session={current} run={run} />}
              {others.map((s) => (
                <SessionRow key={s.id} session={s} run={run} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function deviceIcon(s: SessionType) {
  const ua = `${s.device_name ?? ''} ${s.user_agent ?? ''}`;
  if (/Android|iOS|iPhone|iPad|Mobile/i.test(ua)) return SmartphoneIcon;
  if (/Windows|macOS|Mac OS|Linux/i.test(ua)) return LaptopIcon;
  return MonitorSmartphoneIcon;
}

function SessionRow({
  session: s,
  run,
}: {
  session: SessionType;
  run: (action: () => Promise<unknown>, done: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const logout = useLogout();
  const Icon = deviceIcon(s);

  return (
    <li className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-4">
        <span
          className={
            s.current
              ? 'flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'
              : 'flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground'
          }
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 space-y-0.5">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
            {s.device_name || t('security.unknownDevice')}
            {s.current && (
              <span className="rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-medium text-success">
                {t('security.thisDevice')}
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {s.ip && <span className="font-mono">{s.ip}</span>}
            {s.ip && ' · '}
            {t('security.signedIn', { date: formatDateTime(s.created_at) })}
          </p>
          {s.last_used_at && (
            <p className="text-xs text-muted-foreground">
              {t('security.lastActive', {
                date: formatDateTime(s.last_used_at),
              })}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 pl-15 sm:pl-0">
        {s.current ? (
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            <LogOutIcon />
            {t('common.logout')}
          </Button>
        ) : (
          <>
            <ConfirmDialog
              trigger={
                <Button variant="outline" size="sm">
                  <LogOutIcon />
                  {t('security.signOut')}
                </Button>
              }
              title={t('security.endTitle')}
              description={t('security.endText', {
                device: s.device_name || t('security.thisDeviceFallback'),
              })}
              confirmLabel={t('security.signOut')}
              onConfirm={() => run(() => endSession(s.id), t('security.ended'))}
            />
            {s.device_id && (
              <ConfirmDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t('security.forget')}
                    title={t('security.forget')}
                  >
                    <Trash2Icon />
                  </Button>
                }
                title={t('security.forgetTitle')}
                description={t('security.forgetText')}
                confirmLabel={t('security.forgetConfirm')}
                onConfirm={() =>
                  run(
                    () => forgetDevice(s.device_id as string),
                    t('security.forgotten'),
                  )
                }
              />
            )}
          </>
        )}
      </div>
    </li>
  );
}
