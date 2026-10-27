import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { contractDocumentOptions } from '@/queries/contract/options';

/**
 * Downloads a signed contract's PDF, named after its number. A PDF the page already shows
 * is saved from the cache, without fetching it again.
 */
export function useDownloadContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (c: { id: string; contract_no?: string }) => ({
      pdf: await queryClient.fetchQuery(contractDocumentOptions(c.id)),
      name: `${(c.contract_no ?? c.id).replaceAll('/', '-')}.pdf`,
    }),
    onSuccess: ({ pdf, name }) => {
      const url = URL.createObjectURL(
        new Blob([pdf], { type: 'application/pdf' }),
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      // Some browsers read the URL only after click returns: release it a moment later.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    onError: (err) => showToast('error', apiErrorMessage(toApiError(err))),
  });
}
