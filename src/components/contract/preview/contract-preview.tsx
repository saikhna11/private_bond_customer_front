import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <>
      <ContractTerms preview={preview} />
      <Card>
        <CardHeader>
          <CardTitle>{t('contract.document.title')}</CardTitle>
          <CardDescription>
            {t('contract.document.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocxView preview={preview} />
        </CardContent>
      </Card>
    </>
  );
}
