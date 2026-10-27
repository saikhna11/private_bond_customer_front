import { useEffect, useRef } from 'react';
import SignaturePad from 'signature_pad';

/**
 * A signature pad drawing on canvas. It calls onChange with the drawing as a PNG data URL
 * after every stroke, and with null once cleared.
 */
export function useSignaturePad(onChange: (png: string | null) => void) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pad = useRef<SignaturePad | null>(null);
  const report = useRef(onChange);
  report.current = onChange;

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const p = new SignaturePad(el, {
      penColor: '#1d3a8a',
      minWidth: 1,
      maxWidth: 2.5,
    });
    pad.current = p;
    const emit = () =>
      report.current(p.isEmpty() ? null : p.toDataURL('image/png'));
    p.addEventListener('endStroke', emit);

    // The backing store follows the element's size and the screen's density; resizing
    // clears it, so the drawing is redrawn from its strokes.
    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const data = p.toData();
      el.width = el.offsetWidth * ratio;
      el.height = el.offsetHeight * ratio;
      el.getContext('2d')?.scale(ratio, ratio);
      p.fromData(data);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => {
      observer.disconnect();
      p.removeEventListener('endStroke', emit);
      p.off();
    };
  }, []);

  const clear = () => {
    pad.current?.clear();
    report.current(null);
  };

  return { canvas, clear };
}
