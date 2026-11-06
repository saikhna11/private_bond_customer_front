import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/page-title';
import { BondRequestForm } from '@/components/issuer/bonds/form/bond-request-form';

export const Route = createFileRoute('/_issuer/issuer/bonds/new')({
  component: NewBondRequestPage,
});

/** A new bond request, which staff check and publish. */
function NewBondRequestPage() {
  const { t } = useTranslation();
  return (
    <>
      <Link
        to="/issuer/bonds"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t('issuer.bonds.toList')}
      </Link>
      <PageTitle
        title={t('issuer.bonds.form.title')}
        description={t('issuer.bonds.form.description')}
      />
      <BondRequestForm />
    </>
  );
}
