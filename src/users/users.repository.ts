import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { usersTable } from 'src/db/schema';

type UserStatuses = 'pending' | 'active' | 'blocked';
type UserRoles = 'admin' | 'user' | 'manager';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DbService) {}

  async allUsers() {
    const users = await this.db.client
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        created_at: usersTable.created_at,
      })
      .from(usersTable);
    return users;
  }

  async oneUser(id: number) {
    const [user] = await this.db.client
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        created_at: usersTable.created_at,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    return user;
  }

  async deleteUser(id: number) {
    await this.db.client.delete(usersTable).where(eq(usersTable.id, id));
  }

  async changeStatus(id: number, status: UserStatuses) {
    await this.db.client
      .update(usersTable)
      .set({ status: status })
      .where(eq(usersTable.id, id));
  }

  async changeRole(id: number, role: UserRoles) {
    await this.db.client
      .update(usersTable)
      .set({ role: role })
      .where(eq(usersTable.id, id));
  }
}
