import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Team } from 'src/team/entity/team.entity';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let jwtService: JwtService;
  let userRepo: MockRepository<User>;
  let teamRepo: MockRepository<Team>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Team),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepo = module.get(getRepositoryToken(User));
    teamRepo = module.get(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it.todo('shoudl fail on exist username');
    it.todo('shoudl fail on exist studentId');
    it.todo('should create new user');
    it.todo('should fail on exception');
  });

  describe('login', () => {
    it.todo('shoudl fail if user not found by username');
    it.todo('should fail on wrong password');
    it.todo('should login and get token');
    it.todo('should fail on exception');
    it.todo('should fail on exception');
  });

  describe('findById', () => {
    it.todo('should fail if user not found');
    it.todo('should find user');
    it.todo('should fail on exception');
  });

  describe('deleteUser', () => {
    it.todo('should fail if user not found');
    it.todo('should delete user');
    it.todo('should fail on exception');
  });

  describe('editUser', () => {
    it.todo('should fail on same username');
    it.todo('should fail if already username exist');
    it.todo('should change username');

    it.todo('should fail on same password');
    it.todo('should change password');

    it.todo('should fail on same team');
    it.todo('should change team');

    it.todo('should fail on exception');
  });

  describe('getUser', () => {
    it.todo('should fail if user not found');
    it.todo('should find one user');
    it.todo('should fail on exception');
  });
});
