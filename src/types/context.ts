import { Request, Response } from 'express';
import { User } from 'src/user/entities/user.entity';

export type Ctx = {
  req: Request & { user: Pick<User, 'email' | 'name'> };
  res: Response;
};