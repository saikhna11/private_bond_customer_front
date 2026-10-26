import { useQuery } from '@tanstack/react-query';
import { renderAsync } from 'docx-preview';
import {
  BanknoteIcon,
  CalendarCheckIcon,
  CalendarRangeIcon,
  HashIcon,
  PercentIcon,
  RepeatIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fillDocx } from '@/lib/docx-fill';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { templateFileOptions } from '@/queries/contract/options';
import type { ProductPreviewType } from '@/queries/contract/type';
import { formatAmount, frequencyLabels } from './format';

/**
 * The contract's key terms, then the document itself: the template filled here, in the
 * browser, from the values the backend will fill the signed document with, and the
 * signatures the parties already gave in place.
 */
export function ContractPreview({ preview }: { preview: ProductPreviewType }) {
  const terms = [
    { label: 'Гэрээний дугаар', value: preview.contract_no, Icon: HashIcon },
    {
      label: 'Дүн',
      value: `${formatAmount(preview.principal_amount)} ₮`,
      Icon: BanknoteIcon,
    },
    {
      label: 'Жилийн хүү',
      value: `${Number(preview.annual_rate)}%`,
      Icon: PercentIcon,
    },
    {
      label: 'Хугацаа',
      value: `${preview.term_months} сар`,
      Icon: CalendarRangeIcon,
    },
    {
      label: 'Хүү төлөх',
      value: frequencyLabels[preview.interest_frequency],
      Icon: RepeatIcon,
    },
    {
      label: 'Дуусах огноо',
      value: preview.maturity_date,
      Icon: CalendarCheckIcon,
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Гэрээний нөхцөл</CardTitle>
          <CardDescription>
            Гэрээний дугаар бүх тал гарын үсэг зурсны дараа олгогдоно.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-muted/60 p-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <dt className="truncate text-xs text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="tabular truncate font-semibold">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Гэрээний эх</CardTitle>
          <CardDescription>
            Гарын үсэг зурахаасаа өмнө гэрээг бүтэн уншина уу.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocxView preview={preview} />
        </CardContent>
      </Card>
    </>
  );
}

function DocxView({ preview }: { preview: ProductPreviewType }) {
  const { data, isPending, error } = useQuery(
    templateFileOptions(preview.template.id),
  );
  const container = useRef<HTMLDivElement>(null);
  const [renderFailed, setRenderFailed] = useState(false);

  useEffect(() => {
    const el = container.current;
    if (!data || !el) return;
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    el.replaceChildren();
    fillDocx(data, preview.values, preview.schedule, preview.signatures)
      .then((doc) =>
        renderAsync(doc, el, undefined, {
          inWrapper: true,
          ignoreLastRenderedPageBreak: true,
        }),
      )
      .then(() => {
        const pages = el.querySelector<HTMLElement>('.docx-wrapper');
        const page = pages?.querySelector<HTMLElement>('section.docx');
        if (cancelled || !pages || !page) return;
        // A4 pages are wider than a phone: scale them down to the column, as a PDF viewer
        // would, rather than cut them off. The wrapper centres the pages, so their width
        // and its padding, not its scroll width, is what has to fit.
        const fit = () => {
          pages.style.zoom = '1';
          const style = getComputedStyle(pages);
          const needed =
            page.offsetWidth +
            Number.parseFloat(style.paddingLeft) +
            Number.parseFloat(style.paddingRight);
          pages.style.zoom = String(Math.min(1, el.clientWidth / needed));
        };
        fit();
        observer = new ResizeObserver(fit);
        observer.observe(el);
      })
      .catch(() => setRenderFailed(true));
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [data, preview.values, preview.schedule, preview.signatures]);

  if (isPending) {
    return <Skeleton className="h-[60vh] w-full rounded-xl" />;
  }
  if (error || renderFailed) {
    return (
      <p className="py-10 text-center text-sm text-destructive">
        {error
          ? apiErrorMessage(toApiError(error))
          : 'Гэрээг харуулж чадсангүй.'}
      </p>
    );
  }
  return (
    <div
      ref={container}
      className="max-h-[70vh] overflow-y-auto rounded-xl border bg-muted"
    />
  );
}
