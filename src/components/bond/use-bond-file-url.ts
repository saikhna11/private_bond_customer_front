import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { bondFileOptions } from '@/queries/bond/options';
import type { BondFileType } from '@/queries/bond/type';

/**
 * An object URL of a bond's file, fetched with the session's cookies, which an img tag
 * cannot send cross-origin; revoked when the file changes or the page closes.
 */
export function useBondFileUrl(bondId: string, file?: BondFileType) {
  const { data, isPending, error } = useQuery({
    ...bondFileOptions(bondId, file?.id ?? ''),
    enabled: !!file,
  });
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!data || !file) return;
    const next = URL.createObjectURL(
      new Blob([data], { type: file.content_type }),
    );
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [data, file]);

  return { url, data, isPending: !!file && isPending, error };
}
