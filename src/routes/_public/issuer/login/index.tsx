import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { AuthHeader } from '@/components/auth/auth-header';
import { IssuerLoginForm } from '@/components/issuer/issuer-login-form';

export const Route = createFileRoute('/_public/issuer/login/')({
  component: IssuerLoginPage,
});

function IssuerLoginPage() {
  const { t } = useTranslation();
  return (
    <>
      <AuthHeader
        title={t('issuer.loginTitle')}
        description={t('issuer.loginDescription')}
      />
      <IssuerLoginForm />
      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t('issuer.clientLink')}{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          {t('issuer.clientLinkAction')}
        </Link>
      </p>
    </>
  );
}
