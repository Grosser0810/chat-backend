import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Ctx } from 'src/types/context';
import { User } from './entities/user.entity';
import { ConfirmUserInput, CreateUserInput, LoginInput } from './dto';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async registerUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => User)
  async confirmUser(@Args('input') input: ConfirmUserInput) {
    return this.userService.confirmUser(input);
  }

  @Query(() => User, { nullable: true })
  async login(@Args('input') input: LoginInput, @Context() context: Ctx) {
    return this.userService.login(input, context);
  }

  @Query(() => User, { nullable: true })
  async me(@Context() context: Ctx) {
    return context.req.user;
  }

  @Query(() => User, { nullable: true })
  async logout(@Context() context: Ctx) {
    return this.userService.logout(context);
  }
}
