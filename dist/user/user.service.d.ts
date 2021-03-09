import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { User } from './entity/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { DeleteUserOutput } from './dto/delete-user.dto';
import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';
import { GetUserInput, GetUserOutput } from './dto/get-user.dto';
import { SearchUserInput, SearchUserOutput } from './dto/search-user.dto';
export declare class UserService {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    private generateSlug;
    createUser({ studentId, username, password, }: CreateUserInput): Promise<CreateUserOutput>;
    createAdmin({ username, password, }: CreateUserInput): Promise<CreateUserOutput>;
    login({ username, password }: LoginInput): Promise<LoginOutput>;
    deleteUser(userId: number): Promise<DeleteUserOutput>;
    editUser({ username, password, studentId }: EditUserInput, userId: number): Promise<EditUserOutput>;
    getUser({ userId }: GetUserInput): Promise<GetUserOutput>;
    searchUser({ query }: SearchUserInput): Promise<SearchUserOutput>;
}
