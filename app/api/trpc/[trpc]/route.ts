import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/api/_router';
import { type NextRequest } from 'next/server';

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req: req as unknown as Request,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
