import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SignupForm } from '@/components/auth/signup-form';

export const Route = createFileRoute('/_public/signup/')({
  component: SignupPage,
});

function SignupPage() {
  const { t } = useTranslation();
  return (
    <>
      <SignupForm />
      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t('signup.haveAccount')}{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          {t('common.login')}
        </Link>
      </p>
    </>
  );
}
