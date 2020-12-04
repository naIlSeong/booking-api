import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Team } from './entity/team.entity';
import { TeamService } from './team.service';

const userId = 1;

const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TeamService', () => {
  let service: TeamService;
  let teamRepo: MockRepository<Team>;
  let userRepo: MockRepository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    teamRepo = module.get(getRepositoryToken(Team));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTeam', () => {
    const createTeamArgs = {
      teamName: 'mockTeamName',
    };

    it('should fail if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.createTeam(createTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail on exist team name', async () => {
      userRepo.findOne.mockResolvedValueOnce({ id: userId });
      teamRepo.findOne.mockResolvedValueOnce({
        teamName: createTeamArgs.teamName,
      });

      const result = await service.createTeam(createTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Already team exist',
      });
    });

    it('should fail if already has team', async () => {
      userRepo.findOne.mockResolvedValueOnce({ id: userId, teamId: 1 });
      teamRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.createTeam(createTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Already has team',
      });
    });

    it('should create team', async () => {
      userRepo.findOne.mockResolvedValueOnce({ id: userId });
      teamRepo.findOne.mockResolvedValueOnce(null);
      teamRepo.create.mockReturnValue({
        teamName: createTeamArgs.teamName,
        members: [{ id: userId, teamId: 1 }],
      });
      teamRepo.save.mockResolvedValue({
        teamName: createTeamArgs.teamName,
        members: [{ id: userId, teamId: 1 }],
      });

      const result = await service.createTeam(createTeamArgs, userId);
      expect(result).toEqual({
        ok: true,
      });
      expect(teamRepo.save).toBeCalledTimes(1);
      expect(teamRepo.create).toBeCalledTimes(1);
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await service.createTeam(createTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('registerMember', () => {
    it.todo('should fail if user not found');
    it.todo('should fail if has not team');
    it.todo('should fail if team not found');
    it.todo("should fail if not user's team");
    it.todo('should fail if member not found');
    it.todo('should fail if member already has team');
    it.todo('should register a member');
    it.todo('should fail on exception');
  });

  describe('editTeam', () => {
    it.todo('should fail if user not found');
    it.todo('should fail if has not team');
    it.todo('should fail if team not found');
    it.todo("should fail if not user's team");
    it.todo('should fail on exist team name');
    it.todo('should change team name');
    it.todo('should fail on exception');
  });

  describe('teamDetail', () => {
    it.todo('should fail if team not found');
    it.todo('should find one team');
    it.todo('should fail on exception');
  });

  describe('getTeams', () => {
    it.todo('should find all teams');
    it.todo('should fail on exception');
  });

  describe('deleteTeam', () => {
    it.todo('should fail if user not found');
    it.todo('should fail if has not team');
    it.todo('should fail if team not found');
    it.todo("should fail if not user's team");
    it.todo('should delete a team');
    it.todo('should fail on exception');
  });
});
