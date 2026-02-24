import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';

export type DbTransaction = PgTransaction<PostgresJsQueryResultHKT, any, any>;
