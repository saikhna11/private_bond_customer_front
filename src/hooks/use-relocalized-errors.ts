import { useEffect, useRef } from 'react';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

/**
 * Re-runs validation on the fields showing a schema error when the language changes, so
 * their messages switch too. Errors the server set are left alone.
 */
export function useRelocalizedErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
) {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const previous = useRef(lang);

  useEffect(() => {
    if (previous.current === lang) return;
    previous.current = lang;
    const names = Object.entries(form.formState.errors)
      .filter(([, e]) => e?.type && e.type !== 'server')
      .map(([name]) => name as FieldPath<T>);
    if (names.length > 0) void form.trigger(names);
  }, [lang, form]);
}
