import i18next, { type ParseKeys } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from '@/locales/en';
import { type Messages, mn } from '@/locales/mn';

export const languages = ['mn', 'en'] as const;
export type Lang = (typeof languages)[number];

const STORAGE_KEY = 'pb-lang';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: Messages };
  }
}

function isLang(value: unknown): value is Lang {
  return languages.includes(value as Lang);
}

function storedLanguage(): Lang {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLang(value) ? value : 'mn';
  } catch {
    return 'mn';
  }
}

// Its own instance, registered with react-i18next by initReactI18next.
const i18n = i18next.createInstance();

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // Private mode or blocked storage: the choice lasts this visit only.
  }
});

void i18n.use(initReactI18next).init({
  resources: { mn: { translation: mn }, en: { translation: en } },
  lng: storedLanguage(),
  fallbackLng: 'mn',
  supportedLngs: languages,
  initAsync: false,
  interpolation: { escapeValue: false },
});

export default i18n;

export function currentLanguage(): Lang {
  return i18n.resolvedLanguage === 'en' ? 'en' : 'mn';
}

export function setLanguage(lang: Lang) {
  void i18n.changeLanguage(lang);
}

/**
 * A zod message that follows the current language: zod v4 calls `error` each time an
 * issue is raised, so schemas can stay at module level.
 */
export function msg(key: ParseKeys) {
  return { error: () => i18n.t(key) };
}

type Tree = { [key: string]: string | Tree };

function lookup(tree: Tree, path: string): string | undefined {
  let node: string | Tree | undefined = tree;
  for (const part of path.split('.')) {
    if (typeof node !== 'object') return undefined;
    node = node[part];
  }
  return typeof node === 'string' ? node : undefined;
}

function flatten(tree: Tree, prefix = '', out = new Map<string, string>()) {
  for (const [k, v] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out.set(v, path);
    else flatten(v, path, out);
  }
  return out;
}

const errorTrees: Record<Lang, Tree> = { mn: mn.errors, en: en.errors };

// Message text to its key, in both languages: finds the variant a shared code
// (request.invalid) was sent with, and a client-made message written before a switch.
const keyByText = new Map([
  ...flatten(errorTrees.en),
  ...flatten(errorTrees.mn),
]);

/**
 * An API error's message in the current language. Mongolian shows the server's detail as
 * sent; English translates the code. Unknown codes keep the server's message.
 */
export function apiErrorMessage(err: { code: string; message: string }) {
  const lang = currentLanguage();
  const byText = keyByText.get(err.message);
  if (byText) return lookup(errorTrees[lang], byText) ?? err.message;
  if (lang === 'mn') return err.message;
  return lookup(errorTrees[lang], err.code) ?? err.message;
}
