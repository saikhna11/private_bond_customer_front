import { ArrowLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Button } from '@/components/ui/button';
import { toApiError } from '@/lib/fetcher';
import { contractsRoute } from './route';

/** A contract step that could not load: the API's error or a message, and the way back. */
export function ContractFailed({
  error,
  message,
}: {
  error?: unknown;
  message?: string;
}) {
  const { t } = useTranslation();
  const navigate = contractsRoute.useNavigate();
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-4">
      {error ? (
        <ApiErrorAlert error={toApiError(error)} />
      ) : (
        <p className="text-sm text-destructive">{message}</p>
      )}
      <Button
        variant="outline"
        className="h-10 rounded-xl"
        onClick={() => navigate({ search: {} })}
      >
        <ArrowLeftIcon />
        {t('contract.toList')}
      </Button>
    </div>
  );
}
