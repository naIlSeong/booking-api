import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Team } from 'src/team/entity/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
