import { PenLineIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Moves on from reading the contract to signing it. */
export function ToSignButton({ onClick }: { onClick: () => void }) {
  return (
    <Button className="h-10 rounded-xl px-6" onClick={onClick}>
      <PenLineIcon />
      Гарын үсэг зурах
    </Button>
  );
}
