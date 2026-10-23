import { useQuery } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { MeType } from '@/queries/auth/type';
import { membersOptions } from '@/queries/member/options';

/**
 * What an organization still owes before review: its details, and the signer's position
 * (any active officer with one, as profile_complete counts it).
 */
export function OrgChecklist({ me }: { me: MeType }) {
  const { t } = useTranslation();
  const { data: members } = useQuery(membersOptions());

  const steps = [
    {
      label: t('home.orgSteps.info'),
      hint: t('home.orgSteps.infoHint'),
      done: !!(me.name && me.activity && me.address),
    },
    {
      label: t('home.orgSteps.position'),
      hint: t('home.orgSteps.positionHint'),
      done: !!members?.some((m) => m.is_active && m.position),
    },
  ];

  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {steps.map((s, i) => (
        <li
          key={s.label}
          className={cn(
            'flex items-center gap-3 rounded-xl border p-3',
            s.done ? 'border-success/30 bg-success/5' : 'border-primary/30',
          )}
        >
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
              s.done
                ? 'border-success bg-success text-success-foreground'
                : 'border-primary text-primary',
            )}
          >
            {s.done ? <CheckIcon className="size-4" strokeWidth={3} /> : i + 1}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium">{s.label}</span>
            <span className="block text-xs text-muted-foreground">
              {s.hint}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
