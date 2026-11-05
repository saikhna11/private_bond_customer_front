/** Whole hours left until deadline at now, rounded up: 0 or less once it passed. */
export function hoursLeft(deadline: string, now = Date.now()): number {
  return Math.ceil((Date.parse(deadline) - now) / 3_600_000);
}
