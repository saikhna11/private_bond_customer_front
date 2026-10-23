import { CheckIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { MeType } from '@/queries/auth/type';

type State = 'done' | 'current' | 'failed' | 'todo';

export function KycSteps({ me }: { me: MeType }) {
  const { t } = useTranslation();
  const review: State =
    me.status === 'approved'
      ? 'done'
      : me.status === 'rejected'
        ? 'failed'
        : me.profile_complete
          ? 'current'
          : 'todo';

  const steps: { label: string; hint: string; state: State }[] = [
    { label: t('home.kyc.account'), hint: t('common.verified'), state: 'done' },
    {
      label: t('home.kyc.info'),
      hint: me.profile_complete
        ? t('home.kyc.infoDone')
        : t('home.kyc.infoTodo'),
      state: me.profile_complete ? 'done' : 'current',
    },
    {
      label: t('home.kyc.review'),
      hint:
        review === 'failed'
          ? t('home.kyc.reviewFailed')
          : review === 'done'
            ? t('home.kyc.reviewDone')
            : t('home.kyc.reviewTime'),
      state: review,
    },
    {
      label: t('home.kyc.verified'),
      hint: '',
      state: me.status === 'approved' ? 'done' : 'todo',
    },
  ];

  return (
    <ol className="grid grid-cols-4 gap-2">
      {steps.map((s, i) => (
        <li
          key={s.label}
          className="relative flex flex-col items-center text-center"
        >
          {i > 0 && (
            <span
              aria-hidden="true"
              className={cn(
                'absolute top-4 right-1/2 h-0.5 w-full -translate-y-1/2',
                s.state === 'todo' ? 'bg-border' : 'bg-primary/60',
              )}
            />
          )}
          <span
            className={cn(
              'relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-background text-xs font-semibold',
              s.state === 'done' &&
                'border-success bg-success text-success-foreground',
              s.state === 'current' &&
                'border-primary text-primary ring-4 ring-primary/15',
              s.state === 'failed' &&
                'border-destructive bg-destructive text-white',
              s.state === 'todo' && 'border-border text-muted-foreground',
            )}
          >
            {s.state === 'done' ? (
              <CheckIcon className="size-4" strokeWidth={3} />
            ) : s.state === 'failed' ? (
              <XIcon className="size-4" strokeWidth={3} />
            ) : (
              i + 1
            )}
          </span>
          <span className="mt-2 text-xs font-medium sm:text-sm">{s.label}</span>
          <span className="hidden text-[11px] text-muted-foreground sm:block">
            {s.hint}
          </span>
        </li>
      ))}
    </ol>
  );
}
