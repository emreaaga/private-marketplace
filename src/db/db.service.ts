import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

@Injectable()
export class DbService implements OnModuleDestroy {
  public readonly db: NodePgDatabase<typeof schema>;
  private readonly pool: Pool;

  constructor(private readonly config: ConfigService) {
    const connectionString = this.config.get<string>('DATABASE_URL');

    if (!connectionString) throw new Error('DATABASE_URL is not defined!');

    this.pool = new Pool({ connectionString });

    this.db = drizzle(this.pool, { schema });
    console.log('✔ DB connected');
  }

  async onModuleDestroy() {
    await this.pool.end();
    console.log('✖ DB pool closed');
  }
}
