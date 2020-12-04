import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Team } from './entity/team.entity';
import { TeamService } from './team.service';

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
    it.todo('should fail on exist team name');
    it.todo('should fail if already has team');
    it.todo('should create team');
    it.todo('should fail on exception');
  });

  describe('registerMember', () => {
    it.todo('should fail if has not team');
    it.todo('should fail if team not found');
    it.todo("should fail if not user's team");
    it.todo('should fail if member not found');
    it.todo('should fail if member already has team');
    it.todo('should register a member');
    it.todo('should fail on exception');
  });

  describe('editTeam', () => {
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
    it.todo('should fail if has not team');
    it.todo('should fail if team not found');
    it.todo("should fail if not user's team");
    it.todo('should delete a team');
    it.todo('should fail on exception');
  });
});
