import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowRightIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { productPreviewOptions } from '@/queries/contract/options';
import type { CoHolder, Product } from '@/queries/contract/type';

const schema = z.object({
  register_no: z
    .string()
    .trim()
    .regex(
      /^[А-ЯЁӨҮа-яёөү]{2}[0-9]{8}$/,
      'Регистрийн дугаар 2 кирилл үсэг, 8 цифр байна.',
    ),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{8}$/, 'Утасны дугаар 8 цифр байна.'),
});

/**
 * Names the co-holder of a product's contract: another approved customer, by the register
 * number and phone they signed up with, both. The preview is fetched here, so a co-holder
 * who is not found stays on this form. They sign later, from their own account.
 */
export function CoHolderStep({
  product,
  initial,
  onDone,
}: {
  product: Product;
  initial: CoHolder | null;
  onDone: (coHolder: CoHolder) => void;
}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<ApiError | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { register_no: '', phone: '' },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof schema>) {
    setError(null);
    const coHolder = {
      register_no: values.register_no.toUpperCase(),
      phone: values.phone,
    };
    try {
      await queryClient.fetchQuery(productPreviewOptions(product, coHolder));
      onDone(coHolder);
    } catch (err) {
      const e = toApiError(err);
      if (e.code === 'contract.co_holder_not_found') {
        form.setError('register_no', { message: apiErrorMessage(e) });
        return;
      }
      setError(e);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Хамтран эзэмшигч</CardTitle>
        <CardDescription>
          Хамтран эзэмшигч нь баталгаажсан харилцагч байх ёстой. Түүний
          бүртгүүлсэн регистр болон утасны дугаарыг оруулна уу. Тэрээр гэрээнд
          өөрийн бүртгэлээр нэвтэрч гарын үсэг зурна.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="co_register_no"
              label="Регистрийн дугаар"
              error={errors.register_no?.message}
            >
              <Input
                id="co_register_no"
                placeholder="УБ12345678"
                className="h-10 uppercase"
                autoComplete="off"
                autoFocus
                aria-invalid={!!errors.register_no}
                {...form.register('register_no')}
              />
            </FormField>
            <FormField
              id="co_phone"
              label="Утасны дугаар"
              error={errors.phone?.message}
            >
              <Input
                id="co_phone"
                type="tel"
                inputMode="numeric"
                placeholder="99112233"
                className="h-10"
                autoComplete="off"
                aria-invalid={!!errors.phone}
                {...form.register('phone')}
              />
            </FormField>
          </div>
          <ApiErrorAlert error={error} />
          <Button
            type="submit"
            className="h-10 self-end rounded-xl px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <ArrowRightIcon />
            )}
            Гэрээ рүү
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
