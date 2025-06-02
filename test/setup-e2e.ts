import 'dotenv/config';

import { PrismaClient } from '@generated/prisma/client';
import { randomUUID } from 'crypto';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return Promise.resolve(url.toString());
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = await generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;
  process.env.DEBUG_DB = 'false';

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);

  await prisma.$disconnect();
});
