import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { meOptions } from '@/queries/auth/options';
import { displayName } from '@/queries/auth/type';

/**
 * The reader's name and register (a foreigner's passport) number, tiled diagonally over
 * what it covers: a copy of the prospectus carries who read it. It takes no pointer events,
 * so the page below scrolls as usual.
 */
export function Watermark() {
  const { data: me } = useSuspenseQuery(meOptions());
  const text = [displayName(me), me.register_number ?? me.passport_number]
    .filter(Boolean)
    .join(' · ');
  const background = useMemo(() => {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" transform="rotate(-28 180 100)" font-family="sans-serif" font-size="15" font-weight="600" fill="rgba(100,100,120,0.22)">${escaped}</text></svg>`;
    return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
  }, [text]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 select-none"
      style={{ backgroundImage: background, backgroundRepeat: 'repeat' }}
    />
  );
}
