import { EraserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSignaturePad } from './use-signature-pad';

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
  const { canvas, clear } = useSignaturePad(onChange);

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
          className="mx-auto block aspect-[3/1] w-full max-w-2xl touch-none rounded-xl border-2 border-dashed bg-background"
        />
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Хулгана эсвэл хуруугаараа дээрх талбарт гарын үсгээ зурна уу.
        </p>
      </CardContent>
    </Card>
  );
}
