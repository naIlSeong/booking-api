import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { User } from './entity/user.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
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
          error: 'This password does not match',
        };
      }
      const token = jwt.sign(
        { id: user.id },
        this.configService.get('PRIVATE_KEY'),
      );
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
}
