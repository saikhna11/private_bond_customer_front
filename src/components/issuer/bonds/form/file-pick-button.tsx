import { UploadIcon } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import type { BondFileKind } from '@/queries/issuer-bond/type';

/** The types each kind of a bond's file takes: a prospectus a PDF or an image, a cover an image. */
export const acceptOf: Record<BondFileKind, string> = {
  prospectus: 'application/pdf,image/png,image/jpeg',
  cover: 'image/png,image/jpeg',
};

/** Opens the file picker for kind and hands the picked file on. */
export function FilePickButton({
  kind,
  label,
  disabled,
  busy,
  onPick,
}: {
  kind: BondFileKind;
  label: string;
  disabled?: boolean;
  busy?: boolean;
  onPick: (file: File) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={input}
        type="file"
        accept={acceptOf[kind]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onPick(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || busy}
        onClick={() => input.current?.click()}
      >
        <UploadIcon />
        {label}
      </Button>
    </>
  );
}
