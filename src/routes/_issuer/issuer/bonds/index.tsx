import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { PageTitle } from '@/components/common/page-title';
import { IssuerBondDetail } from '@/components/issuer/bonds/issuer-bond-detail';
import { IssuerBondList } from '@/components/issuer/bonds/issuer-bond-list';
import {
  type IssuerBondFilter,
  issuerBondViews,
} from '@/components/issuer/bonds/issuer-bond-view';
import { Button } from '@/components/ui/button';

/** The issuer's bonds and requests, narrowed by the filters in the URL, or one of them (bondId). */
const day = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .catch(undefined);

const searchSchema = z.object({
  bondId: z.uuid().optional().catch(undefined),
  page: z.number().int().min(1).optional().catch(undefined),
  q: z.string().optional().catch(undefined),
  status: z.enum(issuerBondViews).optional().catch(undefined),
  from: day,
  to: day,
});

export const Route = createFileRoute('/_issuer/issuer/bonds/')({
  validateSearch: searchSchema,
  component: IssuerBondsPage,
});

function IssuerBondsPage() {
  const { t } = useTranslation();
  const { bondId, ...filter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const onFilter = useCallback(
    (patch: IssuerBondFilter) =>
      navigate({
        search: (prev) => ({
          ...prev,
          ...patch,
          // A new filter starts at its first page; a page change keeps the filter.
          page: 'page' in patch ? patch.page : undefined,
        }),
      }),
    [navigate],
  );

  if (bondId) {
    return (
      <IssuerBondDetail
        bondId={bondId}
        onList={() =>
          void navigate({ search: (prev) => ({ ...prev, bondId: undefined }) })
        }
      />
    );
  }
  return (
    <>
      <PageTitle
        title={t('issuer.bonds.title')}
        description={t('issuer.bonds.description')}
        action={
          <Button asChild>
            <Link to="/issuer/bonds/new">
              <PlusIcon />
              {t('issuer.bonds.newRequest')}
            </Link>
          </Button>
        }
      />
      <IssuerBondList
        filter={filter}
        onFilter={onFilter}
        onOpen={(id) =>
          void navigate({ search: (prev) => ({ ...prev, bondId: id }) })
        }
      />
    </>
  );
}
