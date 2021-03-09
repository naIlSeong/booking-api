import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { DeleteUserOutput } from './dto/delete-user.dto';
import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';
import { GetUserInput, GetUserOutput } from './dto/get-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { SearchUserInput, SearchUserOutput } from './dto/search-user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
export declare class UserResolver {
    private readonly userService;
    constructor(userService: UserService);
    me(user: User): User;
    createUser(createUserInput: CreateUserInput): Promise<CreateUserOutput>;
    createAdmin(createUserInput: CreateUserInput): Promise<CreateUserOutput>;
    login(loginInput: LoginInput): Promise<LoginOutput>;
    deleteUser(user: User): Promise<DeleteUserOutput>;
    editUser(editUserInput: EditUserInput, user: User): Promise<EditUserOutput>;
    getUser(getUserInput: GetUserInput): Promise<GetUserOutput>;
    searchUser(searchUserInput: SearchUserInput): Promise<SearchUserOutput>;
}
