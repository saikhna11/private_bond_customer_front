import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { cancelRefresh } from '@/lib/fetcher';
import { logout } from '@/queries/auth/query';

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useCallback(async () => {
    cancelRefresh();
    try {
      await logout();
    } catch {
      // 204 even without a session; a network error still leaves locally.
    }
    queryClient.clear();
    await navigate({ to: '/login' });
  }, [queryClient, navigate]);
}
