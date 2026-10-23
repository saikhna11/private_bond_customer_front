import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { AuthHeader } from '@/components/auth/auth-header';
import { OtpCodeForm } from '@/components/auth/otp-code-form';
import { showToast } from '@/lib/utils';
import { meOptions } from '@/queries/auth/options';
import { resendCode, verifySignup } from '@/queries/auth/query';
import { usePendingSignup } from '@/stores/pending-signup-store';

export const Route = createFileRoute('/_public/verify/')({
  component: VerifyPage,
});

function VerifyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, sent, clear } = usePendingSignup();

  if (!login || !sent) return <Navigate to="/signup" replace />;

  async function onVerify(code: string) {
    if (!login) return;
    await verifySignup(login, code);
    clear();
    await queryClient.fetchQuery(meOptions());
    showToast('success', t('verify.success'));
    await navigate({ to: '/' });
  }

  return (
    <>
      <AuthHeader
        title={
          sent.channel === 'sms' ? t('verify.titleSms') : t('verify.titleEmail')
        }
        description={t('verify.description')}
        back={{ to: '/signup', label: t('common.back') }}
      />
      <OtpCodeForm
        sent={sent}
        onVerify={onVerify}
        onResend={() => resendCode(login)}
      />
    </>
  );
}
