import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  STATISTICS_TIME_WINDOW_SECONDS: z.coerce.number().default(60),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Erro ao validar variáveis de ambiente:', _env.error.format());
  throw new Error('Variáveis de ambiente inválidas.');
}

export const env = _env.data;
