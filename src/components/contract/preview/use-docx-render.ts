import { renderAsync } from 'docx-preview';
import { useEffect, useRef, useState } from 'react';
import { fillDocx } from '@/lib/docx-fill';
import type { ProductPreviewType } from '@/queries/contract/type';

/**
 * Fills the template (data) with the preview's values, schedule and signatures and draws
 * it in container, scaled to the column. failed says it could not be drawn.
 */
export function useDocxRender(
  data: ArrayBuffer | undefined,
  preview: ProductPreviewType,
) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

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
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [data, preview.values, preview.schedule, preview.signatures]);

  return { container, failed };
}
