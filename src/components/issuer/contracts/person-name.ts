/** A person's names as the issuer portal shows them: last name, then first name. */
export function personName(p: {
  last_name?: string;
  first_name?: string;
}): string {
  return [p.last_name, p.first_name].filter(Boolean).join(' ');
}
