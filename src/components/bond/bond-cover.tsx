import { LandmarkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BondType } from '@/queries/bond/type';
import { useBondFileUrl } from './use-bond-file-url';

/** A bond's cover image, or its code on a plain panel while it has none. */
export function BondCover({
  bond,
  className,
}: {
  bond: BondType;
  className?: string;
}) {
  const cover = bond.files.find((f) => f.kind === 'cover');
  const { url } = useBondFileUrl(bond.id, cover);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-primary/8 text-primary',
        className,
      )}
    >
      {url ? (
        <img
          src={url}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span className="flex flex-col items-center gap-1">
          <LandmarkIcon className="size-7" />
          <span className="font-mono text-sm font-semibold">{bond.code}</span>
        </span>
      )}
    </div>
  );
}
