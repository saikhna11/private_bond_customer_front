import { createFileRoute } from '@tanstack/react-router';
import { CustomerLayout } from '@/components/layout/customer-layout';
import { requireAuth } from '@/lib/auth';

export const Route = createFileRoute('/_customer')({
  beforeLoad: async ({ context }) => {
    await requireAuth(context.queryClient);
  },
  component: CustomerLayout,
});
