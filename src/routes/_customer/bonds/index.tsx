import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { BondList } from '@/components/bond/bond-list';
import { PageTitle } from '@/components/common/page-title';

export const Route = createFileRoute('/_customer/bonds/')({
  component: BondsPage,
});

function BondsPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle
        title={t('bond.list.title')}
        description={t('bond.list.description')}
      />
      <BondList />
    </>
  );
}
