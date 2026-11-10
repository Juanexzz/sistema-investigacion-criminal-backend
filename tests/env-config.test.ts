import { describe, it, expect } from 'vitest';
import { envSchema } from '../src/config/env.js';

describe('Environment Configuration Validation', () => {
  const baseValid = {
    DATABASE_URL: 'postgresql://postgres:pass@localhost:5432/db',
    PORT: 4000,
  };

  it('debe rechazar JWT_SECRET menor a 32 caracteres en entorno de producción', () => {
    const result = envSchema.safeParse({
      ...baseValid,
      NODE_ENV: 'production',
      JWT_SECRET: 'secreto_demasiado_corto',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.errors.find((e) => e.path.includes('JWT_SECRET'));
      expect(err?.message).toContain('al menos 32 caracteres en el entorno de producción');
    }
  });

  it('debe aceptar JWT_SECRET de 32 o más caracteres en entorno de producción', () => {
    const result = envSchema.safeParse({
      ...baseValid,
      NODE_ENV: 'production',
      JWT_SECRET: 'clave_de_alta_entropia_con_mas_de_32_caracteres_segura',
    });

    expect(result.success).toBe(true);
  });

  it('debe permitir secretos cortos en desarrollo y test para facilidad de pruebas locales', () => {
    const resultDev = envSchema.safeParse({
      ...baseValid,
      NODE_ENV: 'development',
      JWT_SECRET: 'dev_secret',
    });
    expect(resultDev.success).toBe(true);

    const resultTest = envSchema.safeParse({
      ...baseValid,
      NODE_ENV: 'test',
      JWT_SECRET: 'test_secret',
    });
    expect(resultTest.success).toBe(true);
  });
});
