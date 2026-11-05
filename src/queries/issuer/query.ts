import fetchAndValidate, { scheduleIssuerRefresh } from '@/lib/fetcher';
import {
  IssuerContractPageSchema,
  type IssuerContractTab,
  IssuerMeSchema,
  IssuerSignedInSchema,
} from './type';

export const getIssuerMe = () => fetchAndValidate('issuer/me', IssuerMeSchema);

/** How many contracts a page of the issuer portal's list holds. */
export const issuerContractPageSize = 20;

/** One page of the issuer's contracts in tab, from 1. */
export const getIssuerContracts = (tab: IssuerContractTab, page: number) =>
  fetchAndValidate(
    `issuer/contracts?${new URLSearchParams({
      status: tab,
      page: String(page),
      size: String(issuerContractPageSize),
    })}`,
    IssuerContractPageSchema,
  );

export async function issuerLogin(email: string, password: string) {
  const res = await fetchAndValidate(
    'auth/issuer/login',
    IssuerSignedInSchema,
    {
      method: 'POST',
      body: { email, password },
    },
  );
  scheduleIssuerRefresh(res.access_expires_at);
  return res;
}

export const issuerLogout = () =>
  fetchAndValidate('auth/issuer/logout', undefined, { method: 'POST' });

export async function issuerChangePassword(
  currentPassword: string,
  newPassword: string,
) {
  const res = await fetchAndValidate(
    'auth/issuer/password',
    IssuerSignedInSchema,
    {
      method: 'POST',
      body: { current_password: currentPassword, new_password: newPassword },
    },
  );
  scheduleIssuerRefresh(res.access_expires_at);
  return res;
}
