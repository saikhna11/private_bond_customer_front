import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { AuthHeader } from '@/components/auth/auth-header';
import { LoginForm } from '@/components/auth/login-form';

export const Route = createFileRoute('/_public/login/')({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  return (
    <>
      <AuthHeader
        title={t('login.title')}
        description={t('login.description')}
      />
      <LoginForm />
      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t('login.noAccount')}{' '}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          {t('common.signup')}
        </Link>
      </p>
    </>
  );
}
