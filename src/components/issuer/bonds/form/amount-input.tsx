import type { ComponentProps } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

/** A whole amount typed with thousands separators, kept as plain digits, with its currency. */
export function AmountInput({
  value,
  onChange,
  currency,
  ...props
}: Omit<ComponentProps<typeof InputGroupInput>, 'value' | 'onChange'> & {
  value: string;
  onChange: (digits: string) => void;
  currency: string;
}) {
  return (
    <InputGroup className="h-10">
      <InputGroupInput
        {...props}
        inputMode="numeric"
        className="tabular-nums"
        value={value ? BigInt(value).toLocaleString('en-US') : ''}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, '').slice(0, 26))
        }
      />
      <InputGroupAddon align="inline-end" className="tabular-nums font-normal">
        <span>{currency === 'MNT' ? '₮' : '$'}</span>
      </InputGroupAddon>
    </InputGroup>
  );
}
