import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { usersTable } from 'src/db/schema';
import { CreatedUser, UserByEmail, UserById } from './dto/types/user.types';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: DbService) {}

  async createUser(
    name: string,
    email: string,
    password_hash: string,
  ): Promise<CreatedUser> {
    const [user] = await this.db.client
      .insert(usersTable)
      .values({ name, email, password_hash })
      .returning({ id: usersTable.id, email: usersTable.email });

    return user;
  }

  async findUserByEmail(email: string): Promise<UserByEmail | undefined> {
    const [user] = await this.db.client
      .select({
        id: usersTable.id,
        email: usersTable.email,
        password: usersTable.password_hash,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return user;
  }

  async findUserById(id: number): Promise<UserById | undefined> {
    const [user] = await this.db.client
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    return user;
  }
}
