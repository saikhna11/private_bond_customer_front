import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? t('theme.light') : t('theme.dark')}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
