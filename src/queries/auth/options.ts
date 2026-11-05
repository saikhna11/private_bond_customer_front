import { queryOptions } from '@tanstack/react-query';
import { getBankAccounts, getMe } from './query';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  bankAccounts: () => [...authKeys.all, 'bank-accounts'] as const,
};

export function meOptions() {
  return queryOptions({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });
}

export function bankAccountsOptions() {
  return queryOptions({
    queryKey: authKeys.bankAccounts(),
    queryFn: getBankAccounts,
    staleTime: 1000 * 60,
  });
}
