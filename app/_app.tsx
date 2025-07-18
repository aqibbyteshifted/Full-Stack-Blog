'use client';

import { type AppType } from 'next/app';
import { type NextPage } from 'next';
import { type ReactElement, type ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { api } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import superjson from 'superjson';

import '@/styles/globals.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = {
  Component: NextPageWithLayout;
  pageProps: any;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${window.location.origin}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  );

  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
          {...pageProps}
        >
          {getLayout(
            <div className={cn('min-h-screen bg-background font-sans antialiased')}>
              <Component {...pageProps} />
              <Toaster
                position="bottom-center"
                toastOptions={{
                  className: cn(
                    'bg-background text-foreground border border-border shadow-lg',
                    'dark:bg-background dark:text-foreground',
                  ),
                }}
              />
            </div>
          )}
        </ClerkProvider>
      </QueryClientProvider>
    </api.Provider>
  );
}

export default MyApp;
