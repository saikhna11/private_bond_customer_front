import fetchAndValidate, { scheduleRefresh } from '@/lib/fetcher';
import { deviceName } from '@/lib/format';
import {
  CodeSentSchema,
  MeSchema,
  ResetTokenSchema,
  SignedInSchema,
  type SignupBody,
  type SignupOrganizationBody,
  type UpdateMeBody,
} from './type';

export const getMe = () => fetchAndValidate('me', MeSchema);

export const updateMe = (body: UpdateMeBody) =>
  fetchAndValidate('me', MeSchema, { method: 'PATCH', body });

export const signup = (body: SignupBody) =>
  fetchAndValidate('auth/signup', CodeSentSchema, { method: 'POST', body });

export const signupOrganization = (body: SignupOrganizationBody) =>
  fetchAndValidate('auth/signup/organization', CodeSentSchema, {
    method: 'POST',
    body,
  });

export const resendCode = (login: string) =>
  fetchAndValidate('auth/otp/resend', CodeSentSchema, {
    method: 'POST',
    body: { login },
  });

export async function verifySignup(login: string, code: string) {
  const res = await fetchAndValidate('auth/otp/verify', SignedInSchema, {
    method: 'POST',
    body: { login, code, device_name: deviceName() },
  });
  scheduleRefresh(res.access_expires_at);
  return res;
}

export async function login(loginValue: string, password: string) {
  const res = await fetchAndValidate('auth/login', SignedInSchema, {
    method: 'POST',
    body: { login: loginValue, password, device_name: deviceName() },
  });
  scheduleRefresh(res.access_expires_at);
  return res;
}

export const logout = () =>
  fetchAndValidate('auth/logout', undefined, { method: 'POST' });

export const forgotPassword = (loginValue: string) =>
  fetchAndValidate('auth/password/forgot', undefined, {
    method: 'POST',
    body: { login: loginValue },
  });

export const verifyReset = (loginValue: string, code: string) =>
  fetchAndValidate('auth/password/verify', ResetTokenSchema, {
    method: 'POST',
    body: { login: loginValue, code },
  });

export const resetPassword = (resetToken: string, password: string) =>
  fetchAndValidate('auth/password/reset', undefined, {
    method: 'POST',
    body: { reset_token: resetToken, password },
  });

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const res = await fetchAndValidate('auth/password', SignedInSchema, {
    method: 'POST',
    body: { current_password: currentPassword, new_password: newPassword },
  });
  scheduleRefresh(res.access_expires_at);
  return res;
}

export const requestEmailChange = (email: string) =>
  fetchAndValidate('me/email', CodeSentSchema, {
    method: 'POST',
    body: { email },
  });

export const confirmEmailChange = (code: string) =>
  fetchAndValidate('me/email/verify', MeSchema, {
    method: 'POST',
    body: { code },
  });
