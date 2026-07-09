import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config({ path: '../../.env' });

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://questory:questory_dev_password@localhost:5432/questory?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  datasource: {
    url: databaseUrl
  }
});
