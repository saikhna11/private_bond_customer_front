import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ALL = '__all';

/** A filter select whose first option, allLabel, clears it; the admin's lists use the same. */
export function FilterSelect<T extends string>({
  value,
  onChange,
  allLabel,
  options,
}: {
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  allLabel?: string;
  options: { value: T; label: string }[];
}) {
  return (
    <Select
      value={value ?? ALL}
      onValueChange={(v) => onChange(v === ALL ? undefined : (v as T))}
    >
      <SelectTrigger className="h-9! w-full sm:w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
