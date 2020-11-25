import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  pong(): string {
    return 'pong';
  }
}
