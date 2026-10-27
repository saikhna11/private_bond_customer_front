import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { PageTitle } from '@/components/common/page-title';
import { type Step, Steps } from '@/components/contract/steps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const titles: Record<Step, { title: string; description: string }> = {
  create: { title: 'Бонд сонгох', description: '' },
  view: {
    title: 'Гэрээтэй танилцах',
    description: 'Нөхцөл болон гэрээний эхийг анхааралтай уншина уу.',
  },
  sign: {
    title: 'Гарын үсэг зурах',
    description: 'Та өөрийн гарын үсгийг зурна уу.',
  },
  done: {
    title: 'Гэрээ',
    description: 'Гэрээний эх хувь бэлэн болмогц татаж авах боломжтой.',
  },
};

/** One step of buying a bond: the way back, the step's title and where it sits. */
export function ContractSection({
  step,
  complete,
  title = titles[step].title,
  description = titles[step].description,
  children,
}: {
  step: Step;
  complete?: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
}) {
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
          Гэрээнүүд
        </Link>
      </Button>
      <PageTitle title={title} description={description} />
      <Card className="py-0">
        <CardContent className="px-4 py-5 sm:px-6">
          <Steps current={step} complete={complete} />
        </CardContent>
      </Card>
      {children}
    </div>
  );
}
