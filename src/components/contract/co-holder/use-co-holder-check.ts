import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { productPreviewOptions } from '@/queries/contract/options';
import type { CoHolder, Product } from '@/queries/contract/type';

/**
 * Checks a co-holder by fetching the preview of the product's joint contract with them,
 * which the view step then reads from the cache. A co-holder the backend does not find goes to onNotFound, for the
 * form to show on the number; any other failure is error.
 */
export function useCoHolderCheck(
  product: Product,
  onNotFound: (message: string) => void,
) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<ApiError | null>(null);

  /** Whether the backend found coHolder. */
  async function check(coHolder: CoHolder): Promise<boolean> {
    setError(null);
    try {
      await queryClient.fetchQuery(
        productPreviewOptions(product, 'joint', coHolder),
      );
      return true;
    } catch (err) {
      const e = toApiError(err);
      if (e.code === 'contract.co_holder_not_found') {
        onNotFound(apiErrorMessage(e));
      } else {
        setError(e);
      }
      return false;
    }
  }

  return { error, check };
}
