import { FileTextIcon } from 'lucide-react';

/** The contract list before the client's first contract. */
export function ContractListEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <FileTextIcon className="size-6" />
      </span>
      <p className="font-semibold">Одоогоор гэрээ алга</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Дээрх бондуудаас сонгож анхны гэрээгээ байгуулна уу.
      </p>
    </div>
  );
}
