import { createFileRoute, redirect } from '@tanstack/react-router';
import { IssuerLayout } from '@/components/issuer/issuer-layout';
import { issuerMeOptions } from '@/queries/issuer/options';

export const Route = createFileRoute('/_issuer')({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(issuerMeOptions());
    } catch {
      throw redirect({ to: '/issuer/login' });
    }
  },
  component: IssuerLayout,
});
