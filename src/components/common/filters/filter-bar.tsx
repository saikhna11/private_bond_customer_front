import type { ReactNode } from 'react';

/**
 * A list's filter row, as the admin's lists draw it: the search at the left and the other
 * filters at the right, one row from sm up.
 */
export function FilterBar({
  search,
  children,
}: {
  search?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
      {search}
      {children && (
        <div
          className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center ${search ? 'sm:ml-auto sm:justify-end' : ''}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
