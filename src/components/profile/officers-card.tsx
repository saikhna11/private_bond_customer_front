import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CircleAlertIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UserRoundPlusIcon,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { FormField } from '@/components/common/form-field';
import { PhoneInput } from '@/components/common/phone-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useRelocalizedErrors } from '@/hooks/use-relocalized-errors';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { applyFieldErrors } from '@/lib/form-errors';
import i18n, { apiErrorMessage, msg } from '@/lib/i18n';
import { isValidPhone } from '@/lib/phone';
import { cn, showToast } from '@/lib/utils';
import { authKeys } from '@/queries/auth/options';
import type { MeType } from '@/queries/auth/type';
import { memberKeys, membersOptions } from '@/queries/member/options';
import { addMember, removeMember, updateMember } from '@/queries/member/query';
import type { MemberBody, MemberType } from '@/queries/member/type';

const schema = z.object({
  last_name: z
    .string()
    .trim()
    .min(1, msg('members.errors.lastName'))
    .max(100, msg('validation.tooLong')),
  first_name: z
    .string()
    .trim()
    .min(1, msg('members.errors.firstName'))
    .max(100, msg('validation.tooLong')),
  phone: z.string().trim().refine(isValidPhone, msg('validation.phoneDigits')),
  email: z.email(msg('validation.emailInvalid')).max(254),
  position: z
    .string()
    .trim()
    .min(1, msg('members.errors.position'))
    .max(100, msg('validation.tooLong')),
});

type Values = z.infer<typeof schema>;
type Key = keyof Values;

const keys: Key[] = ['last_name', 'first_name', 'phone', 'email', 'position'];

// Quick picks for the position; any other text is fine too.
const positions = ['ceo', 'director', 'chiefAccountant'] as const;

function initial(member?: MemberType): Values {
  return {
    last_name: member?.last_name ?? '',
    first_name: member?.first_name ?? '',
    phone: member?.phone ?? '',
    email: member?.email ?? '',
    position: member?.position ?? '',
  };
}

/**
 * An organization's officers (GET /me/members). The person who signed up is the first,
 * without a position; review waits for at least one officer with a position, so a change
 * refreshes the client too: profile_complete and the status follow from it. The list
 * locks once the organization is approved.
 */
export function OfficersCard({ me }: { me: MeType }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: members, isPending, error } = useQuery(membersOptions());
  const locked = me.status === 'approved';

  async function changed(done: string) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: memberKeys.all }),
      queryClient.invalidateQueries({ queryKey: authKeys.me() }),
    ]);
    const next = queryClient.getQueryData<MeType>(authKeys.me());
    showToast(
      'success',
      me.status === 'rejected' && next?.status === 'pending'
        ? i18n.t('details.resubmitted')
        : done,
    );
  }

  async function remove(member: MemberType) {
    try {
      await removeMember(member.id);
      await changed(t('members.removed'));
    } catch (err) {
      showToast('error', apiErrorMessage(toApiError(err)));
    }
  }

  const empty = members?.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('members.title')}</CardTitle>
        <CardDescription>
          {locked ? t('members.lockedText') : t('members.description')}
        </CardDescription>
        {!locked && members && !empty && (
          <CardAction>
            <MemberDialog
              onSaved={changed}
              trigger={
                <Button variant="outline" size="sm">
                  <PlusIcon />
                  {t('members.add')}
                </Button>
              }
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="px-0">
        {isPending ? (
          <div className="space-y-3 px-6">
            <Skeleton className="h-16 w-full" />
          </div>
        ) : error ? (
          <p className="px-6 text-sm text-destructive">
            {apiErrorMessage(toApiError(error))}
          </p>
        ) : empty ? (
          <div className="mx-6 flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRoundPlusIcon className="size-5" />
            </span>
            {locked ? (
              <p className="text-sm text-muted-foreground">
                {t('members.emptyLocked')}
              </p>
            ) : (
              <>
                <div className="space-y-1">
                  <p className="font-medium">{t('members.emptyTitle')}</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    {t('members.emptyText')}
                  </p>
                </div>
                <MemberDialog
                  onSaved={changed}
                  trigger={
                    <Button className="h-10 rounded-xl">
                      <PlusIcon />
                      {t('members.addFirst')}
                    </Button>
                  }
                />
              </>
            )}
          </div>
        ) : (
          <ul className="divide-y">
            {members?.map((m) => (
              <li
                key={m.id}
                className={cn(
                  'flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center',
                  !m.position && 'bg-warning/5',
                )}
              >
                <div className="flex flex-1 items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    {`${m.last_name[0] ?? ''}${m.first_name[0] ?? ''}`.toUpperCase()}
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {m.last_name} {m.first_name}
                      {!m.is_active && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {t('members.inactive')}
                        </span>
                      )}
                    </p>
                    {m.position ? (
                      <p className="text-sm text-muted-foreground">
                        {m.position}
                      </p>
                    ) : locked ? null : (
                      // Only the person who signed up starts without one.
                      <MemberDialog
                        member={m}
                        onSaved={changed}
                        trigger={
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-medium text-warning-foreground underline-offset-4 hover:underline dark:text-warning"
                          >
                            <CircleAlertIcon className="size-3.5" />
                            {t('members.positionMissing')}
                          </button>
                        }
                      />
                    )}
                    <p className="tabular text-xs text-muted-foreground">
                      {[m.phone, m.email].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
                {!locked && (
                  <div className="flex gap-2 pl-15 sm:pl-0">
                    <MemberDialog
                      member={m}
                      onSaved={changed}
                      trigger={
                        <Button variant="outline" size="sm">
                          <PencilIcon />
                          {t('members.edit')}
                        </Button>
                      }
                    />
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2Icon />
                          {t('members.remove')}
                        </Button>
                      }
                      title={t('members.removeTitle')}
                      description={t('members.removeText', {
                        name: `${m.last_name} ${m.first_name}`,
                      })}
                      confirmLabel={t('members.remove')}
                      onConfirm={() => remove(m)}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/** Adds an officer, or edits one when given. */
function MemberDialog({
  member,
  trigger,
  onSaved,
}: {
  member?: MemberType;
  trigger: ReactNode;
  onSaved: (done: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {member ? t('members.editTitle') : t('members.addTitle')}
          </DialogTitle>
          <DialogDescription>{t('members.dialogText')}</DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so each opening starts from the saved values. */}
        {open && (
          <MemberForm
            member={member}
            onDone={async (done) => {
              setOpen(false);
              await onSaved(done);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function MemberForm({
  member,
  onDone,
}: {
  member?: MemberType;
  onDone: (done: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [error, setError] = useState<ApiError | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: initial(member),
  });
  const { errors, isSubmitting } = form.formState;
  useRelocalizedErrors(form);
  const position = form.watch('position');

  async function onSubmit(values: Values) {
    setError(null);
    try {
      if (member) {
        const before = initial(member);
        const body: Partial<MemberBody> = {};
        for (const k of keys) if (values[k] !== before[k]) body[k] = values[k];
        if (Object.keys(body).length === 0) {
          showToast('info', t('details.nothingToChange'));
          return;
        }
        await updateMember(member.id, body);
        await onDone(t('members.saved'));
      } else {
        await addMember(values);
        await onDone(t('members.added'));
      }
    } catch (err) {
      const e = toApiError(err);
      if (e.code === 'user.email_taken') {
        form.setError('email', { message: apiErrorMessage(e) });
        return;
      }
      if (e.code === 'user.phone_taken') {
        form.setError('phone', { message: apiErrorMessage(e) });
        return;
      }
      const fields = Object.fromEntries(keys.map((k) => [k, k]));
      if (applyFieldErrors(e, form.setError, fields)) return;
      setError(e);
    }
  }

  const input = (
    name: Exclude<Key, 'phone'>,
    label: string,
    props: React.ComponentProps<typeof Input> = {},
  ) => (
    <FormField
      id={`member_${name}`}
      label={label}
      error={errors[name]?.message}
    >
      <Input
        id={`member_${name}`}
        className="h-10"
        aria-invalid={!!errors[name]}
        {...props}
        {...form.register(name)}
      />
    </FormField>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        {/* The position leads: the first officer is usually the chief executive. */}
        <div className="space-y-2">
          {input('position', t('members.position'), {
            maxLength: 100,
            placeholder: t('members.positionPlaceholder'),
          })}
          <div className="flex flex-wrap gap-1.5">
            {positions.map((p) => {
              const label = t(`members.positions.${p}`);
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={position === label}
                  onClick={() =>
                    form.setValue('position', label, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors outline-none hover:border-primary/50 hover:bg-primary/5 focus-visible:ring-3 focus-visible:ring-ring/50',
                    position === label &&
                      'border-primary bg-primary/10 text-primary',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {input('last_name', t('common.lastName'), { maxLength: 100 })}
          {input('first_name', t('common.firstName'), { maxLength: 100 })}
          <FormField
            id="member_phone"
            label={t('common.phone')}
            error={errors.phone?.message}
          >
            <Controller
              control={form.control}
              name="phone"
              render={({ field }) => (
                <PhoneInput
                  id="member_phone"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  invalid={!!errors.phone}
                />
              )}
            />
          </FormField>
          {input('email', t('common.email'), {
            type: 'email',
            inputMode: 'email',
            autoComplete: 'email',
            maxLength: 254,
            placeholder: 'name@example.com',
          })}
        </div>

        <ApiErrorAlert error={error} />

        <Button type="submit" className="h-10" disabled={isSubmitting}>
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {member ? t('common.save') : t('members.addTitle')}
        </Button>
      </FieldGroup>
    </form>
  );
}
