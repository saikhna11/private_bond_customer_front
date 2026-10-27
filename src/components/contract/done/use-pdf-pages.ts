import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';
import i18n from '@/lib/i18n';

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

/**
 * Draws a PDF (data) in pages, one canvas each, as wide as the column at the screen's
 * density, and again when the column's width changes. ready says the pages are drawn,
 * failed that they could not be.
 */
export function usePdfPages(data: ArrayBuffer | undefined) {
  const pages = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

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
          i18n.t('contract.signed.page', { n, total: doc.numPages }),
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
      setFailed(true);
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

  return { pages, ready, failed };
}
