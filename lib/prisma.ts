import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
prisma.$connect().then(() => console.log('Connected to PostgreSQL')).catch((err: unknown) => console.error('Connection error:', err));

export { prisma };