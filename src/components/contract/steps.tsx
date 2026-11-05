import { CheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export type Step = 'create' | 'pay' | 'view' | 'sign' | 'done';

const steps: Step[] = ['create', 'pay', 'view', 'sign', 'done'];

/**
 * Where the holder is in buying a bond, drawn as the home page's review steps are. complete
 * marks the last step done too, once the signed PDF exists. A phone names only the current
 * step: five names do not fit side by side.
 */
export function Steps({
  current,
  complete = false,
}: {
  current: Step;
  complete?: boolean;
}) {
  const { t } = useTranslation();
  const at = steps.indexOf(current);

  return (
    <ol className="grid grid-cols-5 gap-1 sm:gap-2">
      {steps.map((s, i) => {
        const done = i < at || (complete && i === at);
        const now = i === at && !done;
        return (
          <li
            key={s}
            className="relative flex flex-col items-center text-center"
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-4 right-1/2 h-0.5 w-full -translate-y-1/2',
                  i <= at ? 'bg-primary/60' : 'bg-border',
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-background text-xs font-semibold',
                done && 'border-success bg-success text-success-foreground',
                now && 'border-primary text-primary ring-4 ring-primary/15',
                !done && !now && 'border-border text-muted-foreground',
              )}
            >
              {done ? <CheckIcon className="size-4" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={cn(
                'mt-2 text-xs font-medium sm:block sm:text-sm',
                !now && 'hidden',
              )}
            >
              {t(`contract.steps.${s}.label`)}
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              {t(`contract.steps.${s}.hint`)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
