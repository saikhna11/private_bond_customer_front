import { InfoIcon } from 'lucide-react';
import { partyLabels, partyName } from '@/components/contract/format';
import { Card, CardContent } from '@/components/ui/card';
import type { PreviewPartyType } from '@/queries/contract/type';

/** The parties who still sign, each from their own account, and the deadline for all. */
export function SignersNotice({ others }: { others: PreviewPartyType[] }) {
  return (
    <Card className="border-dashed py-0">
      <CardContent className="flex-row items-start gap-3 p-5 text-sm">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="space-y-1">
          <p>
            {others
              .map((p) => `${partyLabels[p.type]} ${partyName(p)}`)
              .join(', ')}{' '}
            өөрийн бүртгэлээр нэвтэрч гарын үсгээ зурна.
          </p>
          <p className="text-muted-foreground">
            Бүх тал 72 цагийн дотор зурсны дараа гэрээ дугаарлагдаж баталгаажна.
            Эс бөгөөс гэрээ цуцлагдана.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
