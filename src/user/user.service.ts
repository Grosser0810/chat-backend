import { Injectable } from '@nestjs/common';
import { omit } from 'lodash.omit';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { Ctx } from 'src/types/context';
import { signJwt } from 'src/utils/jwt.utils';
import { CookieOptions } from 'express';
import { User, UserDocument } from './entities/user.entity';
import { ConfirmUserInput, CreateUserInput, LoginInput } from './dto';

const cookieOptions: CookieOptions = {
  domain: 'localhost',
  secure: true,
  sameSite: 'strict',
  httpOnly: true,
  path: '/',
};

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(input: CreateUserInput) {
    const confirmToken = nanoid(32);
    return this.userModel.create({ ...input, confirmToken });
  }

  async confirmUser({ email, confirmToken }: ConfirmUserInput) {
    const user = await this.userModel.findOne({ email });

    if (!user || confirmToken !== user.confirmToken) {
      throw new Error('Email or confirm token are incorrect');
    }

    user.active = true;
    user.save();

    return user;
  }

  async login({ email, password }: LoginInput, context: Ctx) {
    const user = await this.userModel
      .findOne({ email })
      .select('-__v -confirmToken');

    const isComparePassword = await user.comparePassword(password);

    if (!user || !isComparePassword) {
      throw new Error('Invalid email or password');
    }

    if (!user.active) {
      throw new Error('Please confirm your email');
    }

    const jwt = signJwt(omit(user.toJSON(), ['password', 'active']));
    context.res.cookie('token', jwt, cookieOptions);

    return user;
  }

  async logout(context) {
    context.res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
    return null;
  }
}
