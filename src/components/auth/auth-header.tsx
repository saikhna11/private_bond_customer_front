import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function AuthHeader({
  title,
  description,
  back,
}: {
  title: string;
  description?: ReactNode;
  back?:
    | { to: '/login' | '/signup'; label: string }
    | { onClick: () => void; label: string };
}) {
  return (
    <div className="mb-8 space-y-2">
      {back &&
        ('to' in back ? (
          <Link
            to={back.to}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            {back.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={back.onClick}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            {back.label}
          </button>
        ))}
      <h2 className="text-[1.75rem] leading-tight font-bold tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
