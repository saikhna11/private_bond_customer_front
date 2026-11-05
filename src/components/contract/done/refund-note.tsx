import { BanknoteIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** That a paid contract which ended has its payment refunded, in text. */
export function RefundNote({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'flex w-full max-w-md items-center gap-2 rounded-xl bg-primary/8 px-3 py-2 text-left text-sm text-primary',
        className,
      )}
    >
      <BanknoteIcon className="size-4 shrink-0" />
      {text}
    </p>
  );
}
