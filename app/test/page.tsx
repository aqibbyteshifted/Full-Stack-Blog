'use client';

import { api } from '@/lib/trpc';

export default function TestPage() {
  const hello = api.hello.useQuery({ text: 'from tRPC' });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          tRPC Test
        </h1>
        <div className="flex flex-col items-center gap-2">
          {hello.data ? (
            <p className="text-2xl">{hello.data.greeting}</p>
          ) : (
            <p className="text-2xl">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
