import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from './options';
import {
  addBankAccount,
  removeBankAccount,
  setDefaultBankAccount,
  updateBankAccount,
  verifyBankAccount,
} from './query';
import type { AddBankAccountBody, BankAccountInput } from './type';

/**
 * Every bank account write refreshes the list and /me: defaults move between accounts,
 * and /me carries the account contracts print. A failed check is recorded on the account
 * too, so errors refresh as well.
 */
function useRefreshBankAccounts() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: authKeys.bankAccounts() }),
      queryClient.invalidateQueries({ queryKey: authKeys.me() }),
    ]);
}

export function useAddBankAccount() {
  const refresh = useRefreshBankAccounts();
  return useMutation({
    mutationFn: (body: AddBankAccountBody) => addBankAccount(body),
    onSettled: refresh,
  });
}

export function useUpdateBankAccount() {
  const refresh = useRefreshBankAccounts();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: BankAccountInput }) =>
      updateBankAccount(id, body),
    onSettled: refresh,
  });
}

export function useSetDefaultBankAccount() {
  const refresh = useRefreshBankAccounts();
  return useMutation({
    mutationFn: (id: string) => setDefaultBankAccount(id),
    onSettled: refresh,
  });
}

export function useRemoveBankAccount() {
  const refresh = useRefreshBankAccounts();
  return useMutation({
    mutationFn: (id: string) => removeBankAccount(id),
    onSettled: refresh,
  });
}

export function useVerifyBankAccount() {
  const refresh = useRefreshBankAccounts();
  return useMutation({
    mutationFn: (id: string) => verifyBankAccount(id),
    onSettled: refresh,
  });
}
