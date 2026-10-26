import { EraserIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import SignaturePad from 'signature_pad';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * A card with a drawing field for one signature, 3:1 like the box it fills in the
 * contract. It reports the drawing as a PNG data URL after every stroke, and null once
 * cleared.
 */
export function SignatureField({
  title,
  description,
  onChange,
}: {
  title: string;
  description?: string;
  onChange: (png: string | null) => void;
}) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <CardAction>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-lg"
            onClick={clear}
          >
            <EraserIcon />
            Арилгах
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvas}
          className="aspect-[3/1] w-full max-w-2xl touch-none rounded-xl border-2 border-dashed bg-background"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Хулгана эсвэл хуруугаараа дээрх талбарт гарын үсгээ зурна уу.
        </p>
      </CardContent>
    </Card>
  );
}
