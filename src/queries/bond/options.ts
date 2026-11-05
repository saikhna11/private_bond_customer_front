import { queryOptions } from '@tanstack/react-query';
import { getBond, getBondFile, getBonds, quoteBond } from './query';
import type { PurchaseBody } from './type';

export const bondKeys = {
  all: ['bond'] as const,
  list: () => [...bondKeys.all, 'list'] as const,
  detail: (id: string) => [...bondKeys.all, 'detail', id] as const,
  file: (id: string, fileId: string) =>
    [...bondKeys.all, 'file', id, fileId] as const,
  quote: (id: string, body: PurchaseBody) =>
    [...bondKeys.all, 'quote', id, body] as const,
};

export function bondsOptions() {
  return queryOptions({ queryKey: bondKeys.list(), queryFn: getBonds });
}

export function bondOptions(id: string) {
  return queryOptions({
    queryKey: bondKeys.detail(id),
    queryFn: () => getBond(id),
  });
}

/** A file's bytes, which never change once uploaded. */
export function bondFileOptions(id: string, fileId: string) {
  return queryOptions({
    queryKey: bondKeys.file(id, fileId),
    queryFn: () => getBondFile(id, fileId),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

/** A purchase's terms; the remaining amount moves, so it is read again after a while. */
export function quoteOptions(id: string, body: PurchaseBody) {
  return queryOptions({
    queryKey: bondKeys.quote(id, body),
    queryFn: () => quoteBond(id, body),
    staleTime: 30 * 1000,
    retry: false,
  });
}
