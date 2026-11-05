import { useTranslation } from 'react-i18next';
import { showToast } from '@/lib/utils';

/** Copies text to the clipboard and says whether it worked. */
export function useCopy() {
  const { t } = useTranslation();
  return (text: string) =>
    navigator.clipboard
      .writeText(text)
      .then(() => showToast('success', t('contract.payment.copied')))
      .catch(() => showToast('error', t('contract.payment.copyFailed')));
}
