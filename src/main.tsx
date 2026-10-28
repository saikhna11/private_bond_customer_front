import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cancelRefresh, setOnUnauthorized } from '@/lib/fetcher';
import i18n from '@/lib/i18n';
import { queryClient } from '@/lib/query-client';
import { showToast } from '@/lib/utils';
import { authKeys } from '@/queries/auth/options';
import { router } from '@/router';
import './index.css';

const PUBLIC_PATHS = ['/login', '/signup', '/verify', '/forgot-password'];

// Registered here so fetcher.ts never imports the router (no import cycle). Runs once a
// refresh failed: the session ended, so sign in again.
setOnUnauthorized(() => {
  const wasSignedIn = queryClient.getQueryData(authKeys.me()) !== undefined;
  cancelRefresh();
  queryClient.clear();

  if (PUBLIC_PATHS.includes(router.state.location.pathname)) return;
  if (wasSignedIn) showToast('warning', i18n.t('session.expired'));
  router.navigate({ to: '/login' });
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster richColors />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
