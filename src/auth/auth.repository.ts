import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { usersTable } from 'src/db/schema';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: DbService) {}

  async createUser(name: string, email: string, password_hash: string) {
    await this.db.client
      .insert(usersTable)
      .values({ name, email, password_hash })
      .returning();
  }

  async findUserByEmail(email: string) {
    const [user] = await this.db.client
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user;
  }
}
