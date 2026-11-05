import { useState } from 'react';
import type { PaymentType } from '@/queries/contract/type';

/** The test transfers the fake bank can make for an order. */
export type MockCase = 'exact' | 'short' | 'over' | 'wrong';

export const mockCases: MockCase[] = ['exact', 'short', 'over', 'wrong'];

/** A description no order's reference matches, to try an unrecognised payment. */
const wrongReference = 'Бонд худалдан авалт';

/**
 * The test transfer the client makes through the fake bank: a case picks its amount and
 * description from what is left to pay (exact, half, half again over, or exact under a
 * description no order matches), and either may be edited after.
 */
export function useMockTransfer(payment: PaymentType) {
  const left = Math.max(0, Number(payment.amount) - Number(payment.received));
  const of = (c: MockCase) => {
    switch (c) {
      case 'short':
        return {
          amount: String(Math.max(1, Math.floor(left / 2))),
          reference: payment.reference,
        };
      case 'over':
        return {
          amount: String(left + Math.floor(left / 2)),
          reference: payment.reference,
        };
      case 'wrong':
        return { amount: String(left), reference: wrongReference };
      default:
        return { amount: String(left), reference: payment.reference };
    }
  };
  const [mockCase, setMockCase] = useState<MockCase>('exact');
  const [values, setValues] = useState(() => of('exact'));
  const pick = (c: MockCase) => {
    setMockCase(c);
    setValues(of(c));
  };
  return {
    mockCase,
    pick,
    amount: values.amount,
    reference: values.reference,
    setAmount: (amount: string) =>
      setValues((v) => ({ ...v, amount: amount.replace(/[^0-9]/g, '') })),
    setReference: (reference: string) =>
      setValues((v) => ({ ...v, reference })),
  };
}
