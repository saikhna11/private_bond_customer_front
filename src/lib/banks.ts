/**
 * Commercial banks of Mongolia, for the bank account's bank name. The value sent to the
 * API stays Mongolian; the label is `banks.<key>` in the current language.
 */
export const banks = [
  { key: 'khan', value: 'Хаан банк' },
  { key: 'golomt', value: 'Голомт банк' },
  { key: 'tdb', value: 'Худалдаа хөгжлийн банк' },
  { key: 'xac', value: 'Хас банк' },
  { key: 'state', value: 'Төрийн банк' },
  { key: 'capitron', value: 'Капитрон банк' },
  { key: 'bogd', value: 'Богд банк' },
  { key: 'trans', value: 'Транс банк' },
  { key: 'arig', value: 'Ариг банк' },
  { key: 'm', value: 'М банк' },
  { key: 'nib', value: 'Үндэсний хөрөнгө оруулалтын банк' },
  { key: 'chinggis', value: 'Чингис хаан банк' },
  { key: 'transport', value: 'Тээвэр хөгжлийн банк' },
] as const;

/**
 * Whether an IBAN passes ISO 13616's mod 97 check: the country code and check digits move
 * to the end, letters become 10 to 35, and the number leaves 1.
 */
export function ibanChecksumValid(iban: string) {
  const s = iban.toUpperCase();
  let rem = 0;
  for (const c of s.slice(4) + s.slice(0, 4)) {
    if (c >= '0' && c <= '9') rem = (rem * 10 + Number(c)) % 97;
    else if (c >= 'A' && c <= 'Z')
      rem = (rem * 100 + c.charCodeAt(0) - 55) % 97;
    else return false;
  }
  return rem === 1;
}

/** Whether a Mongolian IBAN ends with the account number padded with zeros to 12 digits. */
export function ibanMatchesAccount(iban: string, account: string) {
  return account.length <= 12 && iban.slice(-12) === account.padStart(12, '0');
}
