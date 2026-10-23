import { CheckIcon, ChevronDownIcon, SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { countryName } from '@/lib/countries';
import { currentLanguage } from '@/lib/i18n';
import {
  DIAL_CODES,
  flag,
  joinPhone,
  MONGOLIA_DIAL,
  splitPhone,
  USUAL_COUNT,
} from '@/lib/phone';
import { cn } from '@/lib/utils';

/**
 * A searchable country code picker and the number. The value is what the API stores:
 * 8 digits for Mongolia, else + code and digits (see lib/phone).
 */
export function PhoneInput({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  large = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  /** The taller, rounder look of the sign-up form. */
  large?: boolean;
}) {
  const { t } = useTranslation();
  const [iso, setIso] = useState(() => splitPhone(value).iso);
  const [national, setNational] = useState(() => splitPhone(value).national);
  const [open, setOpen] = useState(false);

  // Follow a value set from outside, such as a form reset.
  useEffect(() => {
    if (value !== joinPhone(iso, national)) {
      const next = splitPhone(value);
      setIso(next.iso);
      setNational(next.national);
    }
  }, [value, iso, national]);

  const dial = DIAL_CODES.find((c) => c.iso === iso)?.dial ?? MONGOLIA_DIAL;
  const mongolian = dial === MONGOLIA_DIAL;

  function pick(next: string) {
    setIso(next);
    setOpen(false);
    onChange(joinPhone(next, national));
    // Back to the number, where the user was going.
    requestAnimationFrame(() => document.getElementById(id)?.focus());
  }

  return (
    <div className="flex">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={t('common.countryCode')}
            className={cn(
              'tabular inline-flex shrink-0 items-center gap-1.5 rounded-l-md border border-r-0 border-input bg-muted/50 px-3 text-sm transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
              large ? 'h-12 rounded-l-xl' : 'h-10',
            )}
          >
            <span aria-hidden="true">{flag(iso)}</span>
            <span>+{dial}</span>
            <ChevronDownIcon className="size-3.5 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-0">
          <CountryList selected={iso} onPick={pick} />
        </PopoverContent>
      </Popover>
      <Input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={mongolian ? 8 : 14}
        placeholder={mongolian ? '99112233' : ''}
        value={national}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, '');
          setNational(digits);
          onChange(joinPhone(iso, digits));
        }}
        onBlur={onBlur}
        aria-invalid={invalid}
        className={cn(
          'tabular rounded-l-none',
          large ? 'h-12 rounded-r-xl' : 'h-10',
        )}
      />
    </div>
  );
}

function CountryList({
  selected,
  onPick,
}: {
  selected: string;
  onPick: (iso: string) => void;
}) {
  const { t } = useTranslation();
  const lang = currentLanguage();
  const [query, setQuery] = useState('');

  // The usual countries first, then the rest by name in the current language.
  const entries = useMemo(() => {
    const named = DIAL_CODES.map((c) => ({
      ...c,
      name: countryName(lang, c.iso),
    }));
    const rest = named
      .slice(USUAL_COUNT)
      .sort((a, b) => a.name.localeCompare(b.name, lang));
    return [...named.slice(0, USUAL_COUNT), ...rest];
  }, [lang]);

  const q = query.trim().toLowerCase().replace(/^\+/, '');
  const shown = q
    ? entries.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.dial.startsWith(q) ||
          c.iso.toLowerCase() === q,
      )
    : entries;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b px-3">
        <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
        <input
          // biome-ignore lint/a11y/noAutofocus: the list opens to be searched
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && shown[0]) {
              e.preventDefault();
              onPick(shown[0].iso);
            }
          }}
          placeholder={t('common.searchCountry')}
          className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="max-h-72 overflow-y-auto p-1">
        {shown.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            {t('common.noCountry')}
          </p>
        )}
        {shown.map((c, i) => (
          <div key={c.iso}>
            {!q && i === USUAL_COUNT && <div className="my-1 h-px bg-border" />}
            <button
              type="button"
              onClick={() => onPick(c.iso)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent',
                c.iso === selected && 'font-medium',
              )}
            >
              <span aria-hidden="true">{flag(c.iso)}</span>
              <span className="min-w-0 flex-1 truncate">{c.name}</span>
              <span className="tabular text-muted-foreground">+{c.dial}</span>
              <CheckIcon
                className={cn(
                  'size-4 text-primary',
                  c.iso !== selected && 'invisible',
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
