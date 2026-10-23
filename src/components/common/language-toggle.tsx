import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { currentLanguage, type Lang, languages, setLanguage } from '@/lib/i18n';

export function LanguageToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const lang = currentLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={className}
          aria-label={t('language.label')}
        >
          <span className="text-xs font-semibold tracking-wide">
            {lang.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup
          value={lang}
          onValueChange={(v) => setLanguage(v as Lang)}
        >
          {languages.map((l) => (
            <DropdownMenuRadioItem key={l} value={l}>
              <span className="w-6 font-mono text-xs text-muted-foreground">
                {l.toUpperCase()}
              </span>
              {t(`language.${l}`)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
