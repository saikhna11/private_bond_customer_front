import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ProductPreviewType } from '@/queries/contract/type';
import { ContractTerms } from './contract-terms';
import { DocxView } from './docx-view';

/**
 * The contract's key terms, then the document itself: the template filled here, in the
 * browser, from the values the backend will fill the signed document with, and the
 * signatures the parties already gave in place.
 */
export function ContractPreview({ preview }: { preview: ProductPreviewType }) {
  return (
    <>
      <ContractTerms preview={preview} />
      <Card>
        <CardHeader>
          <CardTitle>Гэрээний эх</CardTitle>
          <CardDescription>
            Гарын үсэг зурахаасаа өмнө гэрээг бүтэн уншина уу.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocxView preview={preview} />
        </CardContent>
      </Card>
    </>
  );
}
