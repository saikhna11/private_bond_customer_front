import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
  Loader2Icon,
  MailIcon,
  RotateCwIcon,
  SmartphoneIcon,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useCountdown } from '@/hooks/use-countdown';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { formatSeconds } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { CodeSentType } from '@/queries/auth/type';

const RESEND_WAIT_MS = 60_000;

/** A code on its way; forgot password learns neither channel nor address. */
export interface SentCode extends Partial<Omit<CodeSentType, 'expires_at'>> {
  expires_at: string;
  /** When this code was sent (epoch ms): resend waits a minute after it. */
  sent_at: number;
}

const CODE_TTL_MS = 5 * 60_000;

/** A code the API sent without saying when it expires (204): five minutes. */
export function sentNow(): SentCode {
  return {
    expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
    sent_at: Date.now(),
  };
}

/**
 * The 6-digit code step shared by sign-up, forgot password and email change: counts down
 * to the code's expiry and keeps resend closed for a minute or for Retry-After.
 */
export function OtpCodeForm({
  sent,
  onVerify,
  onResend,
  submitLabel,
}: {
  sent: SentCode;
  onVerify: (code: string) => Promise<unknown>;
  onResend: () => Promise<CodeSentType | undefined>;
  submitLabel?: string;
}) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [expired, setExpired] = useState(false);
  const [resendAt, setResendAt] = useState(sent.sent_at + RESEND_WAIT_MS);
  const [current, setCurrent] = useState(sent);

  const expiresIn = useCountdown(new Date(current.expires_at).getTime());
  const resendIn = useCountdown(resendAt);
  const isExpired = expired || expiresIn === 0;

  async function verify(value: string) {
    if (value.length !== 6 || verifying) return;
    setVerifying(true);
    setError(null);
    try {
      await onVerify(value);
    } catch (err) {
      const e = toApiError(err);
      setError(e);
      setCode('');
      if (e.code === 'otp.expired') setExpired(true);
      if (e.retryAfter) setResendAt(Date.now() + e.retryAfter * 1000);
    } finally {
      setVerifying(false);
    }
  }

  async function resend() {
    setResending(true);
    setError(null);
    try {
      const next = await onResend();
      setCurrent(next ? { ...next, sent_at: Date.now() } : sentNow());
      setResendAt(Date.now() + RESEND_WAIT_MS);
      setExpired(false);
      setCode('');
    } catch (err) {
      const e = toApiError(err);
      setError(e);
      if (e.retryAfter) setResendAt(Date.now() + e.retryAfter * 1000);
    } finally {
      setResending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void verify(code);
  }

  const throttled = error?.code === 'auth.throttled' && resendIn > 0;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-sm">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {current.channel === 'sms' ? (
            <SmartphoneIcon className="size-4" />
          ) : (
            <MailIcon className="size-4" />
          )}
        </span>
        <p className="text-muted-foreground">
          {current.sent_to ? (
            <Trans
              i18nKey={
                current.channel === 'sms' ? 'otp.sentSms' : 'otp.sentEmail'
              }
              values={{ to: current.sent_to }}
              components={{
                strong: <span className="font-medium text-foreground" />,
              }}
            />
          ) : (
            t('otp.sentUnknown')
          )}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={code}
          onChange={setCode}
          onComplete={(v: string) => void verify(v)}
          disabled={verifying || isExpired}
          autoFocus
          aria-label={t('otp.codeLabel')}
          aria-invalid={error?.code === 'otp.invalid' || undefined}
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                aria-invalid={error?.code === 'otp.invalid' || undefined}
                className="size-12 rounded-lg border text-lg font-semibold first:rounded-lg last:rounded-lg sm:size-13"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <p
          className={cn(
            'tabular text-sm',
            isExpired ? 'text-destructive' : 'text-muted-foreground',
          )}
          aria-live="polite"
        >
          {isExpired
            ? t('otp.expired')
            : t('otp.validFor', { time: formatSeconds(expiresIn) })}
        </p>
      </div>

      <ApiErrorAlert
        error={error}
        message={
          throttled
            ? t('otp.throttled', { time: formatSeconds(resendIn) })
            : undefined
        }
      />

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-xl"
          disabled={code.length !== 6 || verifying || isExpired}
        >
          {verifying && <Loader2Icon className="animate-spin" />}
          {submitLabel ?? t('otp.submit')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="tabular h-10 text-muted-foreground"
          onClick={() => void resend()}
          disabled={resendIn > 0 || resending}
        >
          {resending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <RotateCwIcon />
          )}
          {resendIn > 0
            ? t('otp.resendIn', { time: formatSeconds(resendIn) })
            : t('otp.resend')}
        </Button>
      </div>
    </form>
  );
}
