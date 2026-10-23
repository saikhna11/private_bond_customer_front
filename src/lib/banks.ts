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
