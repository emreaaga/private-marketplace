import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

@Injectable()
export class DbService implements OnModuleDestroy {
  public readonly client: NodePgDatabase<typeof schema>;
  private readonly pool: Pool;

  constructor(private readonly config: ConfigService) {
    const connectionString = this.config.getOrThrow<string>('DATABASE_URL');

    this.pool = new Pool({ connectionString });

    this.client = drizzle(this.pool, { schema });
    console.log('✔ DB connected');
  }

  async onModuleDestroy() {
    await this.pool.end();
    console.log('✖ DB pool closed');
  }
}
