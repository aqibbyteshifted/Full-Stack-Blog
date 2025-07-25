import { initTRPC } from '@trpc/server';
import { NextRequest } from 'next/server';
import superjson from 'superjson';

type Context = {
  req?: Request;
};

const t = initTRPC.context<Context>().create({
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
