import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { OtpCodeForm, type SentCode } from '@/components/auth/otp-code-form';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRelocalizedErrors } from '@/hooks/use-relocalized-errors';
import { type ApiError, toApiError } from '@/lib/fetcher';
import i18n, { apiErrorMessage, msg } from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { authKeys } from '@/queries/auth/options';
import { confirmEmailChange, requestEmailChange } from '@/queries/auth/query';

const schema = z.object({
  email: z.email(msg('validation.emailInvalid')).max(254),
});

/** The email moves only once the code sent to the new address is entered. */
export function ChangeEmailDialog({ current }: { current?: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<{ email: string; sent: SentCode } | null>(
    null,
  );

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setStep(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t('common.change')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('changeEmail.title')}</DialogTitle>
          <DialogDescription>
            {step ? t('changeEmail.codeText') : t('changeEmail.emailText')}
          </DialogDescription>
        </DialogHeader>
        {step ? (
          <EmailCode
            email={step.email}
            sent={step.sent}
            onDone={() => onOpenChange(false)}
          />
        ) : (
          <EmailStep
            current={current}
            onSent={(email, sent) => setStep({ email, sent })}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EmailStep({
  current,
  onSent,
}: {
  current?: string;
  onSent: (email: string, sent: SentCode) => void;
}) {
  const { t } = useTranslation();
  const [error, setError] = useState<ApiError | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(
      schema.refine((v) => v.email.toLowerCase() !== current?.toLowerCase(), {
        path: ['email'],
        ...msg('changeEmail.sameEmail'),
      }),
    ),
    defaultValues: { email: '' },
  });
  const { errors, isSubmitting } = form.formState;
  useRelocalizedErrors(form);

  async function onSubmit({ email }: z.infer<typeof schema>) {
    setError(null);
    try {
      const sent = await requestEmailChange(email);
      onSent(email, { ...sent, sent_at: Date.now() });
    } catch (err) {
      const e = toApiError(err);
      if (e.code === 'user.email_taken') {
        form.setError('email', { message: apiErrorMessage(e) });
        return;
      }
      setError(e);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <FormField
        id="new_email"
        label={t('changeEmail.newEmail')}
        error={errors.email?.message}
      >
        <Input
          id="new_email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="h-10"
          autoFocus
          aria-invalid={!!errors.email}
          {...form.register('email')}
        />
      </FormField>
      <ApiErrorAlert error={error} />
      <Button type="submit" className="h-10" disabled={isSubmitting}>
        {isSubmitting && <Loader2Icon className="animate-spin" />}
        {t('changeEmail.sendCode')}
      </Button>
    </form>
  );
}

function EmailCode({
  email,
  sent,
  onDone,
}: {
  email: string;
  sent: SentCode;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();

  return (
    <OtpCodeForm
      sent={sent}
      onVerify={async (code) => {
        const me = await confirmEmailChange(code);
        queryClient.setQueryData(authKeys.me(), me);
        showToast('success', i18n.t('changeEmail.success'));
        onDone();
      }}
      onResend={() => requestEmailChange(email)}
    />
  );
}
