import { CircleAlertIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';

/** A form's general error: the API's detail, translated by code. */
export function ApiErrorAlert({
  error,
  message,
}: {
  error?: ApiError | null;
  /** Overrides the detail, such as a countdown. */
  message?: string;
}) {
  if (!error) return null;
  return (
    <Alert
      variant="destructive"
      className="border-destructive/25 bg-destructive/5"
    >
      <CircleAlertIcon />
      <AlertDescription>
        <p>{message ?? apiErrorMessage(error)}</p>
      </AlertDescription>
    </Alert>
  );
}
