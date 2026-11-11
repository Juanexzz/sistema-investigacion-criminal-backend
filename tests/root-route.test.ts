import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { env } from '../src/config/env.js';

// Asegurar valores mínimos en entorno de test para que createApp monte todos los sub-routers
if (!env.JWT_SECRET) {
  env.JWT_SECRET = 'test_secret_para_pruebas_de_la_ruta_raiz_32_chars';
}
if (!env.DATABASE_URL) {
  env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
}

import { createApp } from '../src/app.js';

describe('GET / - Ruta raíz pública', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    }
  });

  it('debe responder HTTP 200 con el JSON esperado y sin exponer variables internas', async () => {
    const response = await fetch(`${baseUrl}/`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');

    const body = (await response.json()) as Record<string, unknown>;

    expect(body).toEqual({
      name: 'Sistema de Investigación Criminal API',
      status: 'ok',
      health: '/api/health',
    });

    // Validar que no exponga versiones, variables de entorno ni datos internos
    expect(body).not.toHaveProperty('version');
    expect(body).not.toHaveProperty('env');
    expect(body).not.toHaveProperty('node_env');
    expect(body).not.toHaveProperty('database');
    expect(body).not.toHaveProperty('secret');
    expect(body).not.toHaveProperty('config');
    expect(body).not.toHaveProperty('port');
  });
});
