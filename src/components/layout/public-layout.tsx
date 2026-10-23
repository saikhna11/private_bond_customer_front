import { Outlet, useLocation } from '@tanstack/react-router';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileCheck2Icon,
  LockKeyholeIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/brand/logo';
import { LanguageToggle } from '@/components/common/language-toggle';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { cn } from '@/lib/utils';

const slides = [
  { key: 'invest', Icon: TrendingUpIcon },
  { key: 'transparent', Icon: FileCheck2Icon },
  { key: 'secure', Icon: LockKeyholeIcon },
] as const;

const SLIDE_MS = 6000;

export function PublicLayout() {
  const pathname = useLocation({ select: (l) => l.pathname });

  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      <BrandPanel />

      <div className="flex min-h-svh flex-col">
        <header className="flex h-16 items-center justify-between px-5 sm:px-8">
          <Logo className="lg:invisible" />
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 items-start justify-center px-5 pt-6 pb-12 sm:items-center sm:px-8">
          {/* Keyed by path so each auth step fades in instead of jumping. */}
          <div
            key={pathname}
            className="w-full max-w-[28rem] animate-in fade-in-0 slide-in-from-bottom-2 duration-300 motion-reduce:animate-none"
          >
            <Outlet />
          </div>
        </main>
        <footer className="px-5 pb-6 text-center text-xs text-muted-foreground sm:px-8 lg:hidden">
          © {new Date().getFullYear()} Ulzii &amp; Co
        </footer>
      </div>
    </div>
  );
}

/** The brand side: a slow, pausable slideshow of what the platform offers. */
function BrandPanel() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused]);

  const go = (step: number) =>
    setIndex((i) => (i + step + slides.length) % slides.length);

  return (
    <aside
      className="relative hidden overflow-hidden bg-linear-to-br from-brand-panel to-brand-panel-2 text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
      <div className="absolute -right-40 -bottom-40 size-[32rem] rounded-full bg-gold/15 blur-3xl" />

      <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">
        <Logo inverted />

        <div className="max-w-md">
          <div className="grid">
            {slides.map(({ key, Icon }, i) => (
              <div
                key={key}
                aria-hidden={i !== index}
                className={cn(
                  'col-start-1 row-start-1 space-y-6 transition-all duration-700 ease-out motion-reduce:transition-none',
                  i === index
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-3 opacity-0',
                )}
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Icon className="size-6 text-gold" />
                </span>
                <h1 className="text-[2.25rem] leading-[1.15] font-bold tracking-tight text-balance xl:text-[2.6rem]">
                  {t(`publicLayout.slides.${key}.title`)}
                </h1>
                <p className="text-base text-white/70">
                  {t(`publicLayout.slides.${key}.text`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex size-9 items-center justify-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-gold"
              aria-label={t('publicLayout.previous')}
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={t('publicLayout.slide', { n: i + 1 })}
                  aria-current={i === index}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-500 focus-visible:outline-2 focus-visible:outline-gold',
                    i === index ? 'w-8 bg-gold' : 'w-3 bg-white/30',
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex size-9 items-center justify-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-gold"
              aria-label={t('publicLayout.next')}
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-white/45">
          © {new Date().getFullYear()} Ulzii &amp; Co.{' '}
          {t('publicLayout.rights')}
        </p>
      </div>
    </aside>
  );
}
