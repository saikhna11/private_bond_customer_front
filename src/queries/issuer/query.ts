import fetchAndValidate, { scheduleIssuerRefresh } from '@/lib/fetcher';
import { IssuerMeSchema, IssuerSignedInSchema } from './type';

export const getIssuerMe = () => fetchAndValidate('issuer/me', IssuerMeSchema);

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
