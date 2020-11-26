import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // ✅ Delete Later
  @Query((returns) => String)
  ping() {
    return 'pong';
  }

  @Mutation((returns) => CreateUserOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }
}
