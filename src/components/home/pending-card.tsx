import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ClockIcon, Loader2Icon, RefreshCwIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { refreshSession } from '@/lib/fetcher';
import i18n from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { authKeys, meOptions } from '@/queries/auth/options';

export function PendingCard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [checking, setChecking] = useState(false);

  async function checkAgain() {
    setChecking(true);
    try {
      await refreshSession();
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
      const me = await queryClient.fetchQuery(meOptions());
      if (me.status === 'pending') {
        showToast('info', i18n.t('home.pending.stillReviewing'));
      }
    } finally {
      setChecking(false);
    }
  }

  return (
    <Card className="border-warning/30 bg-warning/5">
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning-foreground dark:text-warning">
          <span className="absolute inset-0 animate-ping rounded-full bg-warning/20 [animation-duration:2.5s] motion-reduce:animate-none" />
          <ClockIcon className="relative size-6" />
        </span>
        <div className="flex-1 space-y-1">
          <p className="font-semibold">{t('home.pending.title')}</p>
          <p className="text-sm text-muted-foreground">
            {t('home.pending.text')}
          </p>
        </div>
        <div className="flex gap-2 sm:flex-col">
          <Button
            className="h-10 flex-1 rounded-xl"
            onClick={() => void checkAgain()}
            disabled={checking}
          >
            {checking ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <RefreshCwIcon />
            )}
            {t('home.pending.checkAgain')}
          </Button>
          <Button asChild variant="outline" className="h-10 flex-1 rounded-xl">
            <Link to="/profile">{t('home.pending.viewInfo')}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
