import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';
import { Response } from 'express';

type PgError = {
  code?: string;
  constraint?: string;
  detail?: string;
};

@Catch(DrizzleQueryError)
export class DrizzlePgExceptionFilter implements ExceptionFilter {
  private readonly errorMappings: Record<
    string,
    { status: number; message: string }
  > = {
    passport_country_unique: {
      status: HttpStatus.CONFLICT,
      message: 'Паспорт уже привязан к другому клиенту',
    },
    users_company_id_companies_id_fk: {
      status: HttpStatus.CONFLICT,
      message: 'Почта не найдена',
    },
    flights_air_partner_id_companies_id_fk: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Указанный авиа-партнер не найден',
    },
    flights_sender_customs_id_companies_id_fk: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Таможня отправителя не найдена',
    },
    flights_receiver_customs_id_companies_id_fk: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Таможня получателя не найдена',
    },
  };

  catch(exception: DrizzleQueryError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const pg = exception.cause as unknown as PgError;
    const constraint = pg?.constraint;
    const code = pg?.code;

    if (constraint && this.errorMappings[constraint]) {
      const { status, message } = this.errorMappings[constraint];

      return res.status(status).json({
        statusCode: status,
        message,
        error: code === '23505' ? 'Conflict' : 'Bad Request',
      });
    }

    if (code === '23503') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Ошибка: указанная связанная запись не существует',
      });
    }

    if (code === '23505') {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Запись с такими данными уже существует',
      });
    }

    console.error('Unhandled Database Error:', {
      code: pg?.code,
      constraint: pg?.constraint,
      message: exception.message,
      params: exception.params,
    });

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Внутренняя ошибка базы данных',
    });
  }
}
