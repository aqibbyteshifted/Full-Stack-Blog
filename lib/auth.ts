'use server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function getUserData() {
  const user = await currentUser();
  if (!user?.id) return { role: null, email: null };

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { role: true, email: true },
  });

  return { role: dbUser?.role || null, email: dbUser?.email || user.emailAddresses[0].emailAddress };
}