import { initTRPC } from '@trpc/server';
import { type NextRequest } from 'next/server';
import superjson from 'superjson';

type CreateContextOptions = {
  headers: Headers;
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCContext = async (opts: { req: NextRequest }) => {
  return {
    ...opts,
  };
};

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
