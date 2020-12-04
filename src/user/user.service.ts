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
import { Team } from 'src/team/entity/team.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({
    studentId,
    username,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const existUsername = await this.userRepo.findOne({ username });
      if (existUsername) {
        return {
          ok: false,
          error: 'Already exist username',
        };
      }
      const user = this.userRepo.create({ username, password });

      if (studentId) {
        const existStudentId = await this.userRepo.findOne({ studentId });
        if (existStudentId) {
          return {
            ok: false,
            error: 'Already exist studentID',
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

  async deleteUser({ id: userId }: DeleteUserInput): Promise<DeleteUserOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
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
    { username, password, teamId }: EditUserInput,
    userId: number,
  ): Promise<EditUserOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      if (username) {
        if (username === user.username) {
          return {
            ok: false,
            error: 'Same Username',
          };
        }
        const exist = await this.userRepo.findOne({ username });
        if (exist) {
          return {
            ok: false,
            error: 'Already username exist',
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

      if (teamId) {
        if (user.teamId === teamId) {
          return {
            ok: false,
            error: 'Same Team',
          };
        }
        const team = await this.teamRepo.findOne({ id: teamId });
        if (!team) {
          return {
            ok: false,
            error: 'Team not found',
          };
        }
        user.team = team;
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
