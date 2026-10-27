import { useQuery } from '@tanstack/react-query';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { contractDocumentOptions } from '@/queries/contract/options';
import type { ContractType } from '@/queries/contract/type';
import { contractNumber } from './format';

/** The signed contract itself, the PDF every party signed, page by page. */
export function SignedContractDocument({
  contract,
}: {
  contract: ContractType;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Гэрээний эх хувь</CardTitle>
        <CardDescription>
          {contractNumber(contract)} дугаартай, бүх талын гарын үсэгтэй гэрээ.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PdfView contractId={contract.id} />
      </CardContent>
    </Card>
  );
}

// The most device pixels a page is drawn with per CSS pixel: a sharper page costs memory
// and shows no more.
const maxPixelRatio = 2;

// How long the column keeps a new width before the pages are drawn again for it.
const redrawDelay = 150;

/**
 * pdf.js and its worker, loaded the first time a PDF is shown, so the page that never
 * shows one never downloads them.
 */
async function loadPdfjs() {
  const [pdfjs, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  return pdfjs;
}

function PdfView({ contractId }: { contractId: string }) {
  const { data, isPending, error } = useQuery(
    contractDocumentOptions(contractId),
  );
  const pages = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [renderFailed, setRenderFailed] = useState(false);

  useEffect(() => {
    const el = pages.current;
    if (!data || !el) return;
    let cancelled = false;
    let generation = 0;
    let drawnWidth = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let observer: ResizeObserver | undefined;
    const tasks = new Set<RenderTask>();
    const cancelTasks = () => {
      for (const task of tasks) task.cancel();
      tasks.clear();
    };

    // Each page fills the column's width, drawn at the screen's density. The pages are
    // swapped in together once all are drawn, so a redraw never shows half a document.
    const draw = async (doc: PDFDocumentProxy) => {
      const width = el.clientWidth;
      if (width === 0 || width === drawnWidth) return;
      drawnWidth = width;
      const current = ++generation;
      cancelTasks();
      const ratio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
      const canvases: HTMLCanvasElement[] = [];
      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n);
        if (cancelled || current !== generation) return;
        const scale = (width / page.getViewport({ scale: 1 }).width) * ratio;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.className = 'block w-full rounded-md bg-white shadow-sm';
        canvas.setAttribute('role', 'img');
        canvas.setAttribute(
          'aria-label',
          `Гэрээний ${n}/${doc.numPages}-р хуудас`,
        );
        const task = page.render({ canvas, viewport });
        tasks.add(task);
        await task.promise;
        tasks.delete(task);
        if (cancelled || current !== generation) return;
        canvases.push(canvas);
      }
      el.replaceChildren(...canvases);
      setReady(true);
    };

    const fail = (err: unknown) => {
      // A redraw or the page closing cancels the pages still drawing: not a failure.
      if (cancelled || (err as Error)?.name === 'RenderingCancelledException') {
        return;
      }
      setRenderFailed(true);
    };

    let destroy: (() => Promise<void>) | undefined;
    loadPdfjs()
      .then((pdfjs) => {
        if (cancelled) return;
        // pdf.js moves the bytes it is given to its worker, emptying them: it gets a
        // copy, so the cached PDF can still be downloaded.
        const loading = pdfjs.getDocument({
          data: new Uint8Array(data.slice(0)),
        });
        destroy = () => loading.destroy();
        return loading.promise.then((doc) => {
          if (cancelled) return;
          observer = new ResizeObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => draw(doc).catch(fail), redrawDelay);
          });
          observer.observe(el);
          return draw(doc);
        });
      })
      .catch(fail);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      observer?.disconnect();
      cancelTasks();
      void destroy?.();
    };
  }, [data]);

  if (error || renderFailed) {
    return (
      <p className="py-10 text-center text-sm text-destructive">
        {error
          ? apiErrorMessage(toApiError(error))
          : 'Гэрээг харуулж чадсангүй. PDF татаж аваад үзнэ үү.'}
      </p>
    );
  }
  return (
    <div
      aria-busy={!ready}
      className="max-h-[75vh] overflow-y-auto rounded-xl border bg-muted p-2 [scrollbar-gutter:stable] sm:p-4"
    >
      {(isPending || !ready) && <Skeleton className="h-[60vh] w-full" />}
      <div ref={pages} className="flex flex-col gap-3" />
    </div>
  );
}
