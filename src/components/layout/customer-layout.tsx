import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet } from '@tanstack/react-router';
import { meOptions } from '@/queries/auth/options';

export function CustomerLayout() {
  const { data: me } = useSuspenseQuery(meOptions());

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
          <Link to="/" className="font-semibold">
            Private Bond
          </Link>
          <span className="truncate text-sm text-muted-foreground">
            {me.name}
          </span>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4">
        <Outlet />
      </main>
    </div>
  );
}
