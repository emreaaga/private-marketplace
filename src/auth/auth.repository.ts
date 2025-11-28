import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { usersTable } from 'src/db/schema';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: DbService) {}

  async createUser(name: string, email: string, password_hash: string) {
    const user = await this.db.db
      .insert(usersTable)
      .values({ name, email, password_hash })
      .returning();
    console.log(user);
  }
}
