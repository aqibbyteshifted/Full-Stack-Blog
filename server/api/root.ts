import { createTRPCRouter } from '@/lib/trpc-server';

export const appRouter = createTRPCRouter({
  // Add your routers here
  // example: exampleRouter,
});

export type AppRouter = typeof appRouter;
