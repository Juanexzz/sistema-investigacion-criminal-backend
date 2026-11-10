import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../src/interface/middlewares/error-handler.middleware.js';
import { notFoundHandler } from '../src/interface/middlewares/not-found.middleware.js';
import { ValidationError, NotFoundError } from '../src/application/errors/app-error.js';

describe('Error Handler and Not Found Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusFn: ReturnType<typeof vi.fn>;
  let jsonFn: ReturnType<typeof vi.fn>;
  let nextFn: NextFunction;

  beforeEach(() => {
    jsonFn = vi.fn();
    statusFn = vi.fn().mockReturnValue({ json: jsonFn });
    mockReq = {
      path: '/api/test',
      method: 'POST',
    };
    mockRes = {
      status: statusFn,
      json: jsonFn,
    };
    nextFn = vi.fn();
  });

  describe('body-parser errors', () => {
    it('debe manejar entity.parse.failed respondiendo 400 con { error: { code, message } }', () => {
      const bodyParserError = {
        type: 'entity.parse.failed',
        status: 400,
        statusCode: 400,
        message: 'Unexpected token } in JSON at position 12',
      };

      errorHandler(bodyParserError, mockReq as Request, mockRes as Response, nextFn);

      expect(statusFn).toHaveBeenCalledWith(400);
      expect(jsonFn).toHaveBeenCalledWith({
        error: {
          code: 'BAD_REQUEST',
          message: 'El cuerpo de la solicitud no contiene un formato JSON válido',
        },
      });
    });

    it('debe manejar entity.too.large respondiendo 413 con { error: { code, message } }', () => {
      const payloadTooLargeError = {
        type: 'entity.too.large',
        status: 413,
        statusCode: 413,
        message: 'request entity too large',
      };

      errorHandler(payloadTooLargeError, mockReq as Request, mockRes as Response, nextFn);

      expect(statusFn).toHaveBeenCalledWith(413);
      expect(jsonFn).toHaveBeenCalledWith({
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'La carga útil de la solicitud excede el tamaño máximo permitido',
        },
      });
    });
  });

  describe('AppError handling', () => {
    it('debe responder con el status y estructura correcta para errores AppError', () => {
      const appErr = new ValidationError('Datos inválidos', [{ field: 'email', message: 'Requerido' }]);

      errorHandler(appErr, mockReq as Request, mockRes as Response, nextFn);

      expect(statusFn).toHaveBeenCalledWith(400);
      expect(jsonFn).toHaveBeenCalledWith({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos inválidos',
          details: [{ field: 'email', message: 'Requerido' }],
        },
      });
    });

    it('debe manejar NotFoundError con 404', () => {
      const notFoundErr = new NotFoundError('Caso no encontrado');

      errorHandler(notFoundErr, mockReq as Request, mockRes as Response, nextFn);

      expect(statusFn).toHaveBeenCalledWith(404);
      expect(jsonFn).toHaveBeenCalledWith({
        error: {
          code: 'NOT_FOUND',
          message: 'Caso no encontrado',
        },
      });
    });
  });

  describe('Prisma known errors', () => {
    it('debe traducir error P2002 a conflicto 409', () => {
      const prismaErr = { code: 'P2002', message: 'Unique constraint failed' };

      errorHandler(prismaErr, mockReq as Request, mockRes as Response, nextFn);

      expect(statusFn).toHaveBeenCalledWith(409);
      expect(jsonFn).toHaveBeenCalledWith({
        error: {
          code: 'CONFLICT',
          message: 'Existe un conflicto con un valor único ya registrado',
        },
      });
    });
  });

  describe('notFoundHandler', () => {
    it('debe responder 404 en formato JSON para rutas desconocidas', () => {
      notFoundHandler(mockReq as Request, mockRes as Response);

      expect(statusFn).toHaveBeenCalledWith(404);
      expect(jsonFn).toHaveBeenCalledWith({
        error: {
          code: 'NOT_FOUND',
          message: 'Ruta no encontrada',
        },
      });
    });
  });
});
