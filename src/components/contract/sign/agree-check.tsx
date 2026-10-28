import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

/** The client's agreement to the contract's terms, which signing waits for. */
export function AgreeCheck({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <Card className="py-0">
      <CardContent className="flex-row items-start gap-3 p-5">
        <Checkbox
          id="agree"
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
        />
        <Label htmlFor="agree" className="leading-snug font-normal">
          {t('contract.sign.agree')}
        </Label>
      </CardContent>
    </Card>
  );
}
