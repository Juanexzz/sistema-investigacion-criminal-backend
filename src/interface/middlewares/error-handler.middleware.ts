import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../application/errors/app-error.js';
import { logger } from '../../infrastructure/services/logger.service.js';

interface PrismaClientKnownRequestErrorLike {
  code: string;
  meta?: Record<string, unknown>;
  message: string;
}

function isPrismaError(error: unknown): error is PrismaClientKnownRequestErrorLike {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    (error as { code: string }).code.startsWith('P')
  );
}

interface BodyParserErrorLike {
  type: string;
  status?: number;
  statusCode?: number;
  message: string;
}

function isBodyParserError(error: unknown): error is BodyParserErrorLike {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    typeof (error as { type: unknown }).type === 'string'
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Manejo de errores de body-parser (JSON malformado o payload demasiado grande)
  if (isBodyParserError(err)) {
    if (err.type === 'entity.parse.failed') {
      res.status(400).json({
        error: {
          code: 'BAD_REQUEST',
          message: 'El cuerpo de la solicitud no contiene un formato JSON válido',
        },
      });
      return;
    }

    if (err.type === 'entity.too.large') {
      res.status(413).json({
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'La carga útil de la solicitud excede el tamaño máximo permitido',
        },
      });
      return;
    }
  }

  // Manejo de errores de la aplicación
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // Manejo de errores conocidos de Prisma
  if (isPrismaError(err)) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'Existe un conflicto con un valor único ya registrado',
        },
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'El registro solicitado no fue encontrado',
        },
      });
      return;
    }

    if (err.code === 'P2003') {
      res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'Violación de restricción de clave foránea o relación',
        },
      });
      return;
    }

    logger.error('Error de Prisma no controlado', { code: err.code, message: err.message });
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno en el servidor de base de datos',
      },
    });
    return;
  }

  // Error genérico no controlado (500) sin stack trace
  const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
  logger.error('Error no controlado en la aplicación', { message: errorMessage });

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ha ocurrido un error interno en el servidor',
    },
  });
}
