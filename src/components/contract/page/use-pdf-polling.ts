import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  contractOptions,
  pdfPollDelay,
  pdfPollLimit,
} from '@/queries/contract/options';

/**
 * A stored contract, polled while its PDF renders: often at first and less often after
 * (pdfPollDelay), only while the tab is visible, and no more after pdfPollLimit. stopped
 * says it gave up; checkAgain checks once and starts over.
 */
export function usePdfPolling(contractId: string) {
  const [since, setSince] = useState(() => Date.now());
  const [stopped, setStopped] = useState(false);
  const query = useQuery({
    ...contractOptions(contractId),
    refetchInterval: (q) =>
      stopped || q.state.data?.status !== 'rendering'
        ? false
        : pdfPollDelay(Date.now() - since),
  });
  const rendering = query.data?.status === 'rendering';

  // The PDF starts rendering when the last party signs, which may be long after the page
  // opened: its polling schedule counts from then. Adjusting the state while rendering, not
  // in an effect, keeps the stop timer from ever seeing the old start.
  const [wasRendering, setWasRendering] = useState(rendering);
  if (rendering !== wasRendering) {
    setWasRendering(rendering);
    if (rendering) {
      setSince(Date.now());
      setStopped(false);
    }
  }

  useEffect(() => {
    if (!rendering || stopped) return;
    const timer = setTimeout(
      () => setStopped(true),
      Math.max(0, pdfPollLimit - (Date.now() - since)),
    );
    return () => clearTimeout(timer);
  }, [rendering, stopped, since]);

  const checkAgain = () => {
    setSince(Date.now());
    setStopped(false);
    void query.refetch();
  };

  return { query, stopped, checkAgain };
}
