import { CircleAlertIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';

/** A form's general error: the API's detail (translated by code) and the request id for support. */
export function ApiErrorAlert({
  error,
  message,
}: {
  error?: ApiError | null;
  /** Overrides the detail, such as a countdown. */
  message?: string;
}) {
  const { t } = useTranslation();
  if (!error) return null;
  return (
    <Alert
      variant="destructive"
      className="border-destructive/25 bg-destructive/5"
    >
      <CircleAlertIcon />
      <AlertDescription>
        <p>{message ?? apiErrorMessage(error)}</p>
        {error.requestId && (
          <p className="mt-1 font-mono text-[11px] opacity-70">
            {t('common.referenceId', { id: error.requestId })}
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
