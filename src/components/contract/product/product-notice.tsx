import type { InfoIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/** Why the client cannot buy a bond yet, and what they can do about it (action). */
export function ProductNotice({
  Icon,
  title,
  text,
  action,
  className,
  iconClassName = 'bg-muted text-muted-foreground',
}: {
  Icon: typeof InfoIcon;
  title: string;
  text: string;
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-full',
            iconClassName,
          )}
        >
          <Icon className="size-6" />
        </span>
        <div className="flex-1 space-y-1">
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
