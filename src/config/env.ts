import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z
      .string({
        required_error: 'DATABASE_URL es obligatoria para iniciar el servidor',
      })
      .min(1, 'DATABASE_URL no puede estar vacía'),
    DIRECT_URL: z.string().optional(),
    JWT_SECRET: z
      .string({
        required_error: 'JWT_SECRET es obligatorio para la seguridad y no tiene valor por defecto',
      })
      .min(1, 'JWT_SECRET no puede estar vacío'),
    JWT_EXPIRES_IN: z.string().default('1d'),
    CORS_ORIGIN: z.string().default('http://localhost:3000'),
    SUPABASE_URL: z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    SUPABASE_BUCKET: z.string().default('case-images'),
  })
  .refine(
    (data) => {
      if (data.NODE_ENV === 'production') {
        return data.JWT_SECRET.length >= 32;
      }
      return true;
    },
    {
      message: 'JWT_SECRET debe tener al menos 32 caracteres en el entorno de producción',
      path: ['JWT_SECRET'],
    },
  );

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  if (process.env.NODE_ENV !== 'test') {
    const formattedErrors = parseResult.error.format();
    process.stderr.write(
      `[ERROR FATAL DE CONFIGURACIÓN] Variables de entorno inválidas o faltantes:\n${JSON.stringify(
        formattedErrors,
        null,
        2,
      )}\n`,
    );
    process.exit(1);
  }
}

export const env = parseResult.success
  ? parseResult.data
  : (process.env as unknown as z.infer<typeof envSchema>);
