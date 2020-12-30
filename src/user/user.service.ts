import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { User, UserRole } from './entity/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { DeleteUserOutput } from './dto/delete-user.dto';
import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';
import { GetUserInput, GetUserOutput } from './dto/get-user.dto';
import { Team } from 'src/team/entity/team.entity';
import { SearchUserInput, SearchUserOutput } from './dto/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    private readonly jwtService: JwtService,
  ) {}

  private generateSlug(username: string): string {
    return username.trim().toLowerCase().replace(/ /g, '-');
  }

  async createUser({
    studentId,
    username,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const usernameSlug = this.generateSlug(username);
      const existUsername = await this.userRepo.findOne({ username });
      const existUsernameSlug = await this.userRepo.findOne({ usernameSlug });
      if (existUsername || existUsernameSlug) {
        return {
          ok: false,
          error: 'Already exist username',
        };
      }
      if (studentId) {
        const existStudentId = await this.userRepo.findOne({ studentId });
        if (existStudentId) {
          return {
            ok: false,
            error: 'Already exist studentID',
          };
        }
      }
      await this.userRepo.save(
        this.userRepo.create({ username, usernameSlug, password, studentId }),
      );
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

  async createAdmin({
    username,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const existAdmin = await this.userRepo.findOne({ role: UserRole.Admin });
      if (existAdmin) {
        return {
          ok: false,
          error: 'Already exist admin',
        };
      }
      const existUsername = await this.userRepo.findOne({ username });
      if (existUsername) {
        return {
          ok: false,
          error: 'Already exist username',
        };
      }
      await this.userRepo.save(
        this.userRepo.create({
          username,
          usernameSlug: this.generateSlug(username),
          password,
          role: UserRole.Admin,
        }),
      );
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
          error: 'User not found',
        };
      }
      const isMatch = await user.checkPassword(password);
      if (!isMatch) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      return {
        ok: true,
        token: this.jwtService.sign(user.id),
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async deleteUser(userId: number): Promise<DeleteUserOutput> {
    try {
      await this.userRepo.delete({ id: userId });
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

  async editUser(
    { username, password, studentId }: EditUserInput,
    userId: number,
  ): Promise<EditUserOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      if (username) {
        const usernameSlug = this.generateSlug(username);
        const exist = await this.userRepo.findOne({ username });
        const existSlug = await this.userRepo.findOne({ usernameSlug });
        if (
          (exist && exist.username !== user.username) ||
          (existSlug && existSlug.usernameSlug !== user.usernameSlug)
        ) {
          return {
            ok: false,
            error: 'Already username exist',
          };
        }
        user.username = username;
        user.usernameSlug = usernameSlug;
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

      if (studentId && studentId !== user.studentId) {
        const exist = await this.userRepo.findOne({ studentId });
        if (exist) {
          return {
            ok: false,
            error: 'Already exist student id',
          };
        }
        user.studentId = studentId;
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

  async searchUser({ query }: SearchUserInput): Promise<SearchUserOutput> {
    try {
      const querySlug = this.generateSlug(query);
      const users = await this.userRepo.find({
        where: {
          usernameSlug: Raw(
            (usernameSlug) => `${usernameSlug} ILIKE '%${querySlug}%'`,
          ),
        },
      });
      if (!users) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      return {
        ok: true,
        users,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }
}
