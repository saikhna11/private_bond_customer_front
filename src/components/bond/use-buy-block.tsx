import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRightIcon, ClockIcon, InfoIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { isIndividual } from '@/lib/client';
import { meOptions } from '@/queries/auth/options';
import type { BondType } from '@/queries/bond/type';
import { BuyNotice } from './buy-notice';

/**
 * Why the signed-in client cannot buy bond now, as a notice, or null when they can: only an
 * approved individual buys, a bond that is selling, with a kind of contract on sale, and not
 * while their earlier order of it still waits for its payment.
 */
export function useBuyBlock(bond: BondType): ReactNode {
  const { t } = useTranslation();
  const { data: me } = useSuspenseQuery(meOptions());

  if (!isIndividual(me)) {
    return (
      <BuyNotice
        Icon={InfoIcon}
        className="border-dashed"
        title={t('bond.buy.individualsOnlyTitle')}
        text={t('bond.buy.individualsOnlyText')}
      />
    );
  }
  if (me.status !== 'approved') {
    return (
      <BuyNotice
        Icon={ClockIcon}
        className="border-warning/30 bg-warning/5"
        iconClassName="bg-warning/15 text-warning-foreground dark:text-warning"
        title={t('bond.buy.notApprovedTitle')}
        text={t('bond.buy.notApprovedText')}
        action={
          <Button asChild variant="outline" className="h-10 rounded-xl">
            <Link to="/profile">
              {t('bond.buy.profile')}
              <ArrowRightIcon />
            </Link>
          </Button>
        }
      />
    );
  }
  if (bond.sales_status !== 'selling') {
    return (
      <BuyNotice
        Icon={ClockIcon}
        className="border-dashed"
        title={t(`bond.buy.notSelling.${bond.sales_status}`)}
        text={t('bond.buy.notSellingText')}
      />
    );
  }
  if (bond.pending_contract_id) {
    return (
      <BuyNotice
        Icon={ClockIcon}
        className="border-primary/30 bg-primary/5"
        title={t('bond.buy.pendingOrderTitle')}
        text={t('bond.buy.pendingOrderText')}
        action={
          <Button asChild className="h-10 rounded-xl">
            <Link
              to="/contracts"
              search={{ contractId: bond.pending_contract_id }}
            >
              {t('bond.buy.pendingOrder')}
              <ArrowRightIcon />
            </Link>
          </Button>
        }
      />
    );
  }
  if (!bond.options.some((o) => o.available)) {
    return (
      <BuyNotice
        Icon={InfoIcon}
        className="border-dashed"
        title={t('bond.buy.noTemplateTitle')}
        text={t('bond.buy.noTemplateText')}
      />
    );
  }
  return null;
}
