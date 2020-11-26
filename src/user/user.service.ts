import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
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
}
