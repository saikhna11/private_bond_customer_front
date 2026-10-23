import { en } from '@/locales/en';
import { mn } from '@/locales/mn';
import type { Lang } from './i18n';

// ISO 3166-1 alpha-2, without MN: a foreigner's nationality.
const CODES =
  'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(
    ' ',
  );

const PRIORITY = ['CN', 'RU', 'KR', 'JP', 'US', 'KZ', 'DE', 'GB'];

function names(lang: Lang): Intl.DisplayNames | undefined {
  try {
    return new Intl.DisplayNames(lang === 'mn' ? ['mn', 'en'] : ['en'], {
      type: 'region',
    });
  } catch {
    return undefined;
  }
}

const display: Record<Lang, Intl.DisplayNames | undefined> = {
  mn: names('mn'),
  en: names('en'),
};

// Many browsers lack Mongolian region names: the usual ones by hand, in both languages.
const BY_HAND: Record<Lang, Record<string, string>> = {
  mn: mn.countries,
  en: en.countries,
};

export function countryName(lang: Lang, code?: string): string {
  if (!code) return '';
  const c = code.toUpperCase();
  return BY_HAND[lang][c] ?? display[lang]?.of(c) ?? c;
}

const lists: Partial<Record<Lang, { code: string; name: string }[]>> = {};

/** Neighbours and the usual nationalities first, then the rest by name. */
export function countries(lang: Lang) {
  lists[lang] ??= [
    ...PRIORITY,
    ...CODES.filter((c) => !PRIORITY.includes(c)).sort((a, b) =>
      countryName(lang, a).localeCompare(countryName(lang, b), lang),
    ),
  ].map((code) => ({ code, name: countryName(lang, code) }));
  return lists[lang];
}

export const priorityCount = PRIORITY.length;
