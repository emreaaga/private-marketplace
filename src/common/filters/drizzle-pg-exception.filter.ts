import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { DrizzleQueryError } from 'drizzle-orm';

type PgError = {
  code?: string;
  constraint?: string;
  detail?: string;
};

@Catch(DrizzleQueryError)
export class DrizzlePgExceptionFilter implements ExceptionFilter {
  catch(exception: DrizzleQueryError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const pg = exception.cause as unknown as PgError;
    console.log(pg.constraint);

    if (pg?.code !== '23505' || pg?.constraint !== 'passport_country_unique') {
      throw exception;
    }
    const duplicatePassport = exception.params;
    console.log(duplicatePassport);

    res.status(409).json({
      statusCode: 409,
      message: 'Паспорт уже привязан к другому клиенту',
    });
  }
}
