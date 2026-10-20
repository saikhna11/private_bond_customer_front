import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';
import { meOptions } from '@/queries/auth/options';
import type { MeType } from '@/queries/auth/type';

/** For a route's beforeLoad. Redirects to /login without a session. */
export async function requireAuth(queryClient: QueryClient): Promise<MeType> {
  try {
    return await queryClient.ensureQueryData(meOptions());
  } catch {
    throw redirect({ to: '/login' });
  }
}
