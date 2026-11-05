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
 * What the client picks of bond: an option, a term it offers, how many bonds, and who
 * holds them. One bond costs the purchase unit (bond.md 3.2), so the amount the purchase
 * sends is quantity times unit: between minQuantity, the minimum purchase in bonds, and
 * maxQuantity, what remains or what the investor cap leaves the client alone
 * (investor_bought), whichever is less. The backend checks the rest (6.9, a joint
 * holding's cap). The term is typed or stepped; one outside the option's terms is an error. body is the purchase once every
 * field is filled and passes the checks the browser can make, a moment after the last
 * change, for the quote; errors name what fails.
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
  const unit = Number(bond.purchase_unit);
  const minQuantity = Math.max(1, Math.ceil(Number(bond.min_purchase) / unit));
  const maxQuantity = Math.min(
    Math.floor(Number(bond.remaining) / unit),
    bond.investor_cap
      ? Math.floor(
          (Number(bond.investor_cap) - Number(bond.investor_bought ?? 0)) /
            unit,
        )
      : Number.POSITIVE_INFINITY,
  );
  const [quantity, setQuantityState] = useState<number | undefined>(
    minQuantity,
  );
  const setQuantity = setQuantityState;
  const amount = quantity ? String(quantity * unit) : '';
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
    const out: {
      term?: string;
      quantity?: string;
      registerNo?: string;
      phone?: string;
    } = {};
    if (!term) {
      out.term = t('bond.buy.errors.termRequired');
    } else if (!terms.includes(term)) {
      out.term = t('bond.buy.errors.termInvalid', {
        min: terms[0],
        max: terms[terms.length - 1],
        step: terms.length > 1 ? terms[1] - terms[0] : 1,
      });
    }
    if (maxQuantity < minQuantity) {
      out.quantity = t('bond.buy.errors.capReached');
    } else if (!quantity) {
      out.quantity = t('bond.buy.errors.quantityRequired');
    } else if (quantity < minQuantity) {
      out.quantity = t('bond.buy.errors.quantityMin', { count: minQuantity });
    } else if (quantity > maxQuantity) {
      out.quantity = t('bond.buy.errors.quantityMax', { count: maxQuantity });
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
  }, [
    term,
    terms,
    quantity,
    minQuantity,
    maxQuantity,
    ownership,
    registerNo,
    phone,
    t,
  ]);

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
    unit,
    quantity,
    setQuantity,
    minQuantity,
    maxQuantity,
    amount,
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
