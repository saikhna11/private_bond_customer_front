import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useContractApi } from '@/queries/contract/api';
import {
  contractOptions,
  pdfPollDelay,
  pdfPollLimit,
} from '@/queries/contract/options';

/** How often an order waiting for its payment is checked, and for how long at most. */
const paymentPollDelay = 5000;
const paymentPollLimit = 15 * 60 * 1000;

/**
 * A stored contract, polled while its PDF renders: often at first and less often after
 * (pdfPollDelay), only while the tab is visible, and no more after pdfPollLimit. An order
 * waiting for its payment is polled every paymentPollDelay for paymentPollLimit, so the page
 * moves on once the bank transfer is matched. stopped says it gave up; checkAgain checks
 * once and starts over.
 */
export function usePdfPolling(contractId: string) {
  const [since, setSince] = useState(() => Date.now());
  const [stopped, setStopped] = useState(false);
  const query = useQuery({
    ...contractOptions(contractId, useContractApi()),
    refetchInterval: (q) => {
      if (stopped) return false;
      if (q.state.data?.status === 'pending_payment') return paymentPollDelay;
      return q.state.data?.status === 'rendering'
        ? pdfPollDelay(Date.now() - since)
        : false;
    },
  });
  const paying = query.data?.status === 'pending_payment';
  const waiting = query.data?.status === 'rendering' || paying;
  const limit = paying ? paymentPollLimit : pdfPollLimit;

  // The PDF starts rendering when the last party signs, which may be long after the page
  // opened: its polling schedule counts from then. Adjusting the state while rendering, not
  // in an effect, keeps the stop timer from ever seeing the old start.
  const [wasWaiting, setWasWaiting] = useState(waiting);
  if (waiting !== wasWaiting) {
    setWasWaiting(waiting);
    if (waiting) {
      setSince(Date.now());
      setStopped(false);
    }
  }

  useEffect(() => {
    if (!waiting || stopped) return;
    const timer = setTimeout(
      () => setStopped(true),
      Math.max(0, limit - (Date.now() - since)),
    );
    return () => clearTimeout(timer);
  }, [waiting, stopped, since, limit]);

  const checkAgain = () => {
    setSince(Date.now());
    setStopped(false);
    void query.refetch();
  };

  return { query, stopped, checkAgain };
}
