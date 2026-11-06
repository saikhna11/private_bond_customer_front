import { SearchIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

/** A list's search box: it reports once the typing stops, as the admin's lists do. */
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const { t } = useTranslation();
  const [text, setText] = useState(value);
  const debounced = useDebouncedValue(text, 300);

  useEffect(() => setText(value), [value]);
  useEffect(() => {
    if (debounced.trim() !== value) onChange(debounced.trim());
  }, [debounced, value, onChange]);

  return (
    <div className="relative w-full sm:w-72">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="h-9 pr-8 pl-9"
        aria-label={placeholder}
      />
      {text && (
        <button
          type="button"
          onClick={() => setText('')}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          aria-label={t('filters.clearSearch')}
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
