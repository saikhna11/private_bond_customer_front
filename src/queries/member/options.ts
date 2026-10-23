import { queryOptions } from '@tanstack/react-query';
import { getMembers } from './query';

export const memberKeys = {
  all: ['members'] as const,
  list: () => [...memberKeys.all, 'list'] as const,
};

export function membersOptions() {
  return queryOptions({
    queryKey: memberKeys.list(),
    queryFn: getMembers,
    staleTime: 1000 * 60,
  });
}
