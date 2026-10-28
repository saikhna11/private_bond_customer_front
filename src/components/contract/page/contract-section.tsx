import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/page-title';
import { type Step, Steps } from '@/components/contract/steps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * One step of buying a bond: the way back, the step's title (its own unless title is given)
 * and where it sits.
 */
export function ContractSection({
  step,
  complete,
  title,
  description,
  children,
}: {
  step: Step;
  complete?: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 self-start rounded-lg text-muted-foreground"
      >
        <Link to="/contracts" search={{}}>
          <ArrowLeftIcon />
          {t('contract.toList')}
        </Link>
      </Button>
      <PageTitle
        title={title ?? t(`contract.sections.${step}.title`)}
        description={description ?? t(`contract.sections.${step}.description`)}
      />
      <Card className="py-0">
        <CardContent className="px-4 py-5 sm:px-6">
          <Steps current={step} complete={complete} />
        </CardContent>
      </Card>
      {children}
    </div>
  );
}
