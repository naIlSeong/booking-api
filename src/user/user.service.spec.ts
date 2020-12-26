import { boolean } from '@hapi/joi';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Team } from 'src/team/entity/team.entity';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

const TOKEN = 'MOCK_TOKEN';

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => TOKEN),
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
    const createUserArgs = {
      username: 'mockUsername',
      password: 'mockPassword',
      studentId: 123456,
    };

    it('shoudl fail on exist username', async () => {
      userRepo.findOne.mockResolvedValue({
        id: 1,
        username: createUserArgs.username,
      });

      const result = await service.createUser(createUserArgs);
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: false,
        error: 'Already exist username',
      });
    });

    it('shoudl fail on exist studentId', async () => {
      userRepo.findOne.mockResolvedValueOnce(null);
      userRepo.create.mockReturnValue({
        username: createUserArgs.username,
        studentId: createUserArgs.studentId,
      });
      userRepo.findOne.mockResolvedValueOnce({
        id: 1,
        username: 'any',
        studentId: createUserArgs.studentId,
      });

      const result = await service.createUser(createUserArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Already exist studentID',
      });
    });

    it('should create new user', async () => {
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue(createUserArgs);
      userRepo.save.mockResolvedValue(createUserArgs);

      const result = await service.createUser(createUserArgs);
      expect(userRepo.findOne).toHaveBeenCalled();
      expect(userRepo.create).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await service.createUser(createUserArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('createAdmin', () => {
    const createAdminArgs = {
      username: 'mockUsername',
      password: 'mockPassword',
    };

    it('shoudl fail on exist admin', async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: 1,
        role: 'Admin',
      });

      const result = await service.createAdmin(createAdminArgs);
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: false,
        error: 'Already exist admin',
      });
    });

    it('shoudl fail on exist username', async () => {
      userRepo.findOne.mockResolvedValueOnce(null);
      userRepo.findOne.mockResolvedValueOnce({
        id: 1,
        username: createAdminArgs.username,
      });

      const result = await service.createAdmin(createAdminArgs);
      expect(userRepo.findOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        ok: false,
        error: 'Already exist username',
      });
    });

    it('should create admin', async () => {
      userRepo.findOne.mockResolvedValueOnce(null);
      userRepo.findOne.mockResolvedValueOnce(null);
      userRepo.create.mockReturnValue({ ...createAdminArgs, role: 'Admin' });
      userRepo.save.mockResolvedValue({ ...createAdminArgs, role: 'Admin' });

      const result = await service.createAdmin(createAdminArgs);
      expect(userRepo.findOne).toHaveBeenCalledTimes(2);
      expect(userRepo.create).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await service.createAdmin(createAdminArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('login', () => {
    const loginArgs = {
      username: 'mockUsername',
      password: 'mockPassword',
    };

    it('shoudl fail if user not found by username', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail on wrong password', async () => {
      const wrongLoginArgs = {
        username: loginArgs.username,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepo.findOne.mockResolvedValue(wrongLoginArgs);

      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Wrong password',
      });
    });

    it('should login and get token', async () => {
      const validLoginArgs = {
        username: loginArgs.username,
        password: loginArgs.password,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      userRepo.findOne.mockResolvedValue(validLoginArgs);

      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: true,
        token: TOKEN,
      });
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('deleteUser', () => {
    const deleteUserArgs = {
      id: 1,
    };

    it('should delete user', async () => {
      const result = await service.deleteUser(deleteUserArgs.id);
      expect(userRepo.delete).toBeCalledWith({ id: deleteUserArgs.id });
      expect(userRepo.delete).toBeCalledTimes(1);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      userRepo.delete.mockRejectedValue(new Error());

      const result = await service.deleteUser(deleteUserArgs.id);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('editUser', () => {
    const mockUser = {
      id: 1,
      username: 'mockUser',
      password: 'mockPassword',
      studentId: 123456,
      teamId: 1,
    };
    const editUserArgs = {
      username: 'newUsername',
      password: 'newPassword',
      studentId: 654321,
      teamId: 2,
    };

    it('should fail if already username exist', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      userRepo.findOne.mockResolvedValue({
        id: 2,
        username: editUserArgs.username,
      });

      const result = await service.editUser(editUserArgs, mockUser.id);
      expect(result).toEqual({
        ok: false,
        error: 'Already username exist',
      });
    });

    it('should change username', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      userRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.editUser(
        { username: editUserArgs.username },
        mockUser.id,
      );
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on same password', async () => {
      const mockUserPassword = {
        ...mockUser,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      userRepo.findOne.mockResolvedValue(mockUserPassword);

      const result = await service.editUser(
        { password: editUserArgs.password },
        mockUser.id,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Same Password',
      });
    });

    it('should change password', async () => {
      const mockUserPassword = {
        ...mockUser,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepo.findOne.mockResolvedValue(mockUserPassword);

      const result = await service.editUser(
        { password: editUserArgs.password },
        mockUser.id,
      );
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exist student id', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      userRepo.findOne.mockResolvedValueOnce({
        id: 2,
        studentId: editUserArgs.studentId,
      });

      const result = await service.editUser(
        { studentId: editUserArgs.studentId },
        mockUser.id,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Already exist student id',
      });
    });

    it('should change student id', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      userRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.editUser(
        { studentId: editUserArgs.studentId },
        mockUser.id,
      );
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on same team', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      teamRepo.findOne.mockResolvedValue({
        id: mockUser.teamId,
      });

      const result = await service.editUser(
        { teamId: mockUser.teamId },
        mockUser.id,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Same Team',
      });
    });

    it('should fail if team not found', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      teamRepo.findOne.mockResolvedValue(null);

      const result = await service.editUser(
        { teamId: editUserArgs.teamId },
        mockUser.id,
      );
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(teamRepo.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: false,
        error: 'Team not found',
      });
    });

    it('should change team', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      teamRepo.findOne.mockResolvedValueOnce({
        id: editUserArgs.teamId,
      });

      const result = await service.editUser(
        { teamId: editUserArgs.teamId },
        mockUser.id,
      );
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await service.editUser(editUserArgs, mockUser.id);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('getUser', () => {
    const getUserArgs = { userId: 1 };

    it('should fail if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.getUser(getUserArgs);
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should find one user', async () => {
      const user = userRepo.findOne.mockResolvedValue({
        id: getUserArgs.userId,
      });

      const result = await service.getUser(getUserArgs);
      expect(result).toEqual({
        ok: true,
        user: expect.any(Object),
      });
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await service.getUser(getUserArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });
});
