import { createFileRoute } from '@tanstack/react-router';
import { ForgotPasswordFlow } from '@/components/auth/forgot-password-flow';

export const Route = createFileRoute('/_public/forgot-password/')({
  component: ForgotPasswordFlow,
});
