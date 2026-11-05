import { Link, type LinkProps } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** The way back to the page a bond page came from. */
export function BackLink({
  label,
  ...link
}: { label: string } & Pick<LinkProps, 'to' | 'params'>) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="-ml-2 self-start rounded-lg text-muted-foreground"
    >
      <Link {...link}>
        <ArrowLeftIcon />
        {label}
      </Link>
    </Button>
  );
}
