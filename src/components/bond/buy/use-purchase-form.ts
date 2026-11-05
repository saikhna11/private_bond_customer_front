import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { PERSON_REGISTER } from '@/lib/client';
import { isValidPhone } from '@/lib/phone';
import type { BondType, PurchaseBody } from '@/queries/bond/type';
import { termsOf } from '../format';

export type BuyOwnership = PurchaseBody['ownership_type'];

const CYRILLIC = /[А-ЯЁӨҮ]/i;

/**
 * What the client picks of bond: an option, a term it offers, the amount, and who holds
 * it. body is the purchase once every field is filled and passes the checks the browser
 * can make, a moment after the last change, for the quote; errors name what fails.
 */
export function usePurchaseForm(bond: BondType) {
  const { t } = useTranslation();
  const ownerships = bond.options
    .filter((o) => o.available && !o.ttd)
    .map((o) => o.ownership_type)
    .filter((o): o is BuyOwnership => o === 'individual' || o === 'joint');
  const [optionId, setOptionId] = useState(bond.rate_options[0]?.id ?? '');
  const option = bond.rate_options.find((o) => o.id === optionId);
  const terms = option ? termsOf(option) : [];
  const [term, setTerm] = useState<number | undefined>(terms[0]);
  const [amount, setAmount] = useState(bond.min_purchase.replace(/\.0+$/, ''));
  const [ownership, setOwnership] = useState<BuyOwnership>(
    ownerships[0] ?? 'individual',
  );
  const [registerNo, setRegisterNo] = useState('');
  const [phone, setPhone] = useState('');

  const pickOption = (id: string) => {
    setOptionId(id);
    const next = bond.rate_options.find((o) => o.id === id);
    const nextTerms = next ? termsOf(next) : [];
    setTerm((m) => (m && nextTerms.includes(m) ? m : nextTerms[0]));
  };

  const errors = useMemo(() => {
    const out: { amount?: string; registerNo?: string; phone?: string } = {};
    const n = Number(amount);
    const unit = Number(bond.purchase_unit);
    if (!amount || !Number.isFinite(n)) {
      out.amount = t('bond.buy.errors.amountRequired');
    } else if (n < Number(bond.min_purchase) || n % unit !== 0) {
      out.amount = t('bond.buy.errors.amountStep');
    } else if (n > Number(bond.remaining)) {
      out.amount = t('bond.buy.errors.amountRemaining');
    }
    if (ownership === 'joint') {
      const r = registerNo.trim();
      if (!r) out.registerNo = t('contract.coHolder.registerNoRequired');
      else if (CYRILLIC.test(r) && !PERSON_REGISTER.test(r.toUpperCase())) {
        out.registerNo = t('details.errors.register');
      }
      if (!isValidPhone(phone)) out.phone = t('validation.phoneDigits');
    }
    return out;
  }, [amount, bond, ownership, registerNo, phone, t]);

  const ready = !!option && !!term && Object.keys(errors).length === 0;
  const body = useDebouncedValue<PurchaseBody | undefined>(
    useMemo(
      () =>
        ready && option && term
          ? {
              rate_option_id: option.id,
              term_months: term,
              amount,
              ownership_type: ownership,
              ...(ownership === 'joint'
                ? {
                    co_holder: {
                      register_no: registerNo.trim().toUpperCase(),
                      phone,
                    },
                  }
                : {}),
            }
          : undefined,
      [ready, option, term, amount, ownership, registerNo, phone],
    ),
    400,
  );

  return {
    ownerships,
    option,
    pickOption,
    terms,
    term,
    setTerm,
    amount,
    setAmount,
    ownership,
    setOwnership,
    registerNo,
    setRegisterNo,
    phone,
    setPhone,
    errors,
    body: ready ? body : undefined,
  };
}

export type PurchaseForm = ReturnType<typeof usePurchaseForm>;
