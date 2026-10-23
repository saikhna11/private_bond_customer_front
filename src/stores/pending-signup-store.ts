import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { SentCode } from '@/components/auth/otp-code-form';

interface PendingSignupState {
  /**
   * The login waiting for its code (an email, or an organization's register number);
   * sessionStorage, so a reload keeps the step.
   */
  login: string | null;
  sent: SentCode | null;
  start: (login: string, sent: SentCode) => void;
  clear: () => void;
}

export const usePendingSignup = create<PendingSignupState>()(
  persist(
    (set) => ({
      login: null,
      sent: null,
      start: (login, sent) => set({ login, sent }),
      clear: () => set({ login: null, sent: null }),
    }),
    {
      name: 'pending-signup',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
