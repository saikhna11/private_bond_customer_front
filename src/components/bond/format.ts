import i18n from '@/lib/i18n';
import {
  type Frequency,
  frequencyMonths,
  type RateOptionType,
} from '@/queries/bond/type';

const moneyFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const signs: Record<string, string> = { MNT: '₮', USD: '$' };

/** An amount in a currency, as the bond pages print it: 1,000,000 ₮. */
export function formatMoney(value: string | number, currency: string): string {
  const amount = moneyFormat.format(Number(value));
  return currency === 'USD'
    ? `$${amount}`
    : `${amount} ${signs[currency] ?? currency}`;
}

/** How often an option pays interest, in the current language. */
export function frequencyText(f: Frequency): string {
  return i18n.t(`contract.frequency.${f}`);
}

/** A percent from a decimal string: 21%, 18.5%. */
export function percent(value: string): string {
  return `${Number(value)}%`;
}

/** The lowest and highest rate of a bond's options: 18%, or 18-21%. */
export function rateRange(options: RateOptionType[]): string {
  if (options.length === 0) return '';
  const rates = options.map((o) => Number(o.annual_rate));
  const lo = Math.min(...rates);
  const hi = Math.max(...rates);
  return lo === hi ? `${lo}%` : `${lo}-${hi}%`;
}

/** The shortest and longest term of a bond's options, in months: 12, or 6-24. */
export function termRange(options: RateOptionType[]): string {
  if (options.length === 0) return '';
  const lo = Math.min(...options.map((o) => o.term_min_months));
  const hi = Math.max(...options.map((o) => o.term_max_months));
  return lo === hi
    ? i18n.t('contract.months', { count: lo })
    : i18n.t('bond.monthsRange', { from: lo, to: hi });
}

/**
 * The terms an option offers: every month in its range that its frequency divides, so its
 * last interest payment falls on maturity; any month of it for at_maturity.
 */
export function termsOf(o: RateOptionType): number[] {
  const step = frequencyMonths[o.interest_frequency] || 1;
  const out: number[] = [];
  for (let m = o.term_min_months; m <= o.term_max_months; m++) {
    if (m % step === 0) out.push(m);
  }
  return out;
}
