import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/role.decorator';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { DeleteUserInput, DeleteUserOutput } from './dto/delete-user.dto';
import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';
import { GetUserInput, GetUserOutput } from './dto/get-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  @Role(['Any'])
  me(@AuthUser() user: User) {
    return user;
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

  @Mutation((returns) => DeleteUserOutput)
  @Role(['Admin'])
  deleteUser(
    @Args('input') deleteUserInput: DeleteUserInput,
  ): Promise<DeleteUserOutput> {
    return this.userService.deleteUser(deleteUserInput);
  }

  @Mutation((returns) => EditUserOutput)
  @Role(['User'])
  editUser(
    @Args('input') editUserInput: EditUserInput,
    @AuthUser() user: User,
  ): Promise<EditUserOutput> {
    return this.userService.editUser(editUserInput, user.id);
  }

  @Query((returns) => GetUserOutput)
  @Role(['Any'])
  getUser(@Args('input') getUserInput: GetUserInput): Promise<GetUserOutput> {
    return this.userService.getUser(getUserInput);
  }
}
