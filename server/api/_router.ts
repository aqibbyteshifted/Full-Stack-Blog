import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  // Test procedure
  hello: t.procedure
    .input(z.object({ text: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      };
    }),
  // Add more procedures here
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
