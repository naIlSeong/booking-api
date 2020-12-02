import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { User } from './entity/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { DeleteUserInput, DeleteUserOutput } from './dto/delete-user.dto';
import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';
import { GetUserInput, GetUserOutput } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    try {
      const existUsername = await this.userRepo.findOne({
        username: createUserInput.username,
      });
      if (existUsername) {
        return {
          ok: false,
          error: 'This username is already in use',
        };
      }
      if (createUserInput.studentId) {
        const existStudentId = await this.userRepo.findOne({
          studentId: createUserInput.studentId,
        });
        if (existStudentId) {
          return {
            ok: false,
            error: 'This student ID is already in use',
          };
        }
      }
      await this.userRepo.save(this.userRepo.create(createUserInput));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async login({ username, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepo.findOne({ username });
      if (!user) {
        return {
          ok: false,
          error: 'User not exist',
        };
      }
      const isMatch = await user.checkPassword(password);
      if (!isMatch) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async findById(userId: number): Promise<User> {
    return this.userRepo.findOne({ id: userId });
  }

  async deleteUser({ id }: DeleteUserInput): Promise<DeleteUserOutput> {
    try {
      const user = await this.userRepo.findOne({ id });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      await this.userRepo.delete({ id });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  // Todo: Team
  async editUser(
    { username, password }: EditUserInput,
    user: User,
  ): Promise<EditUserOutput> {
    try {
      if (username) {
        if (username === user.username) {
          return {
            ok: false,
            error: 'Same Username',
          };
        }
        user.username = username;
      }

      if (password) {
        const isMatch = await user.checkPassword(password);
        if (isMatch) {
          return {
            ok: false,
            error: 'Same Password',
          };
        }
        user.password = password;
      }

      await this.userRepo.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async getUser({ userId }: GetUserInput): Promise<GetUserOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }

      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }
}
