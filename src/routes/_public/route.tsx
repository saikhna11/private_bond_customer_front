import { createFileRoute, redirect } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/public-layout';
import { authKeys } from '@/queries/auth/options';
import { issuerKeys } from '@/queries/issuer/options';

export const Route = createFileRoute('/_public')({
  beforeLoad: ({ context, location }) => {
    // Cache only: no /me request from the login page. A bond issuer's sign-in is apart
    // from a client's: each login page leaves only its own signed-in user.
    if (location.pathname.startsWith('/issuer')) {
      if (context.queryClient.getQueryData(issuerKeys.me())) {
        throw redirect({ to: '/issuer' });
      }
      return;
    }
    if (context.queryClient.getQueryData(authKeys.me())) {
      throw redirect({ to: '/' });
    }
  },
  component: PublicLayout,
});
