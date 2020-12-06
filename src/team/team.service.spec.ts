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
    const registerMemberArgs = {
      memberId: 2,
    };

    it('should fail if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.registerMember(registerMemberArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail if has not team', async () => {
      userRepo.findOne.mockResolvedValue({
        id: userId,
      });

      const result = await service.registerMember(registerMemberArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Not have a team',
      });
    });

    it('should fail if team not found', async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: 1,
      });
      teamRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.registerMember(registerMemberArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Team not found',
      });
    });

    it("should fail if not user's team", async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: 1,
      });
      teamRepo.findOne.mockResolvedValueOnce({ id: 2 });

      const result = await service.registerMember(registerMemberArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: "You can't do this",
      });
    });

    it('should fail if member not found', async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: 1,
      });
      teamRepo.findOne.mockResolvedValueOnce({ id: 1 });
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.registerMember(registerMemberArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail if member already has team', async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: 1,
      });
      teamRepo.findOne.mockResolvedValueOnce({
        id: 1,
        members: [{ id: userId, teamId: 1 }],
      });
      userRepo.findOne.mockResolvedValue({
        id: registerMemberArgs.memberId,
        teamId: 2,
      });

      const result = await service.registerMember(registerMemberArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Already has team',
      });
    });

    it('should register a member', async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: 1,
      });
      teamRepo.findOne.mockResolvedValueOnce({
        id: 1,
        members: [{ id: userId, teamId: 1 }],
      });
      userRepo.findOne.mockResolvedValue({
        id: registerMemberArgs.memberId,
      });
      teamRepo.save.mockReturnValue({
        id: 1,
        members: [
          { id: userId, teamId: 1 },
          { id: registerMemberArgs.memberId, temaId: 1 },
        ],
      });
      userRepo.save.mockReturnValue({
        id: registerMemberArgs.memberId,
        teamId: 1,
      });

      const result = await service.registerMember(registerMemberArgs, userId);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await service.registerMember(registerMemberArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('editTeam', () => {
    const editTeamArgs = {
      teamId: 1,
      teamName: 'mockTeamName',
    };

    it('should fail if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.editTeam(editTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail if has not team', async () => {
      userRepo.findOne.mockResolvedValue({
        id: userId,
      });

      const result = await service.editTeam(editTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Not have a team',
      });
    });

    it('should fail if team not found', async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: editTeamArgs.teamId,
      });
      teamRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.editTeam(editTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Team not found',
      });
    });

    it("should fail if not user's team", async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: editTeamArgs.teamId,
      });
      teamRepo.findOne.mockResolvedValueOnce({
        id: 2,
      });

      const result = await service.editTeam(editTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: "You can't do this",
      });
    });

    it('should fail on exist team name', async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: editTeamArgs.teamId,
      });
      teamRepo.findOne.mockResolvedValueOnce({
        id: editTeamArgs.teamId,
      });
      teamRepo.findOne.mockResolvedValueOnce({
        teamName: editTeamArgs.teamName,
      });

      const result = await service.editTeam(editTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Already team exist',
      });
    });

    it('should change team name', async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: editTeamArgs.teamId,
      });
      teamRepo.findOne.mockResolvedValueOnce({
        id: editTeamArgs.teamId,
      });
      teamRepo.findOne.mockResolvedValueOnce(null);
      teamRepo.save.mockReturnValue({
        id: editTeamArgs.teamId,
        teamName: editTeamArgs.teamName,
      });

      const result = await service.editTeam(editTeamArgs, userId);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await service.editTeam(editTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('teamDetail', () => {
    const teamDetailArgs = {
      teamId: 1,
    };

    it('should fail if team not found', async () => {
      teamRepo.findOne.mockResolvedValue(null);

      const result = await service.teamDetail(teamDetailArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Team not found',
      });
    });

    it('should find one team', async () => {
      teamRepo.findOne.mockResolvedValue({
        id: teamDetailArgs.teamId,
      });

      const result = await service.teamDetail(teamDetailArgs);
      expect(result).toEqual({
        ok: true,
        team: expect.any(Object),
      });
    });

    it('should fail on exception', async () => {
      teamRepo.findOne.mockRejectedValue(new Error());

      const result = await service.teamDetail(teamDetailArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('getTeams', () => {
    it('should find all teams', async () => {
      teamRepo.find.mockResolvedValue([
        {
          teamId: 1,
        },
      ]);

      const result = await service.getTeams();
      expect(result).toEqual({
        ok: true,
        teams: [expect.any(Object)],
      });
    });

    it('should fail on exception', async () => {
      teamRepo.find.mockRejectedValue(new Error());

      const result = await service.getTeams();
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('deleteTeam', () => {
    const deleteTeamArgs = {
      teamId: 1,
    };

    it('should fail if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.deleteTeam(deleteTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail if has not team', async () => {
      userRepo.findOne.mockResolvedValue({
        id: userId,
      });

      const result = await service.deleteTeam(deleteTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Not have a team',
      });
    });

    it('should fail if team not found', async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: 2,
      });
      teamRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.deleteTeam(deleteTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Team not found',
      });
    });

    it("should fail if not user's team", async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: 2,
      });
      teamRepo.findOne.mockResolvedValueOnce({
        id: deleteTeamArgs.teamId,
      });

      const result = await service.deleteTeam(deleteTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: "You can't do this",
      });
    });

    it('should delete a team', async () => {
      userRepo.findOne.mockResolvedValueOnce({
        id: userId,
        teamId: deleteTeamArgs.teamId,
      });
      teamRepo.findOne.mockResolvedValueOnce({
        id: deleteTeamArgs.teamId,
      });

      const result = await service.deleteTeam(deleteTeamArgs, userId);
      expect(result).toEqual({
        ok: true,
      });
      expect(teamRepo.delete).toBeCalledTimes(1);
      expect(teamRepo.delete).toBeCalledWith({ id: deleteTeamArgs.teamId });
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await service.deleteTeam(deleteTeamArgs, userId);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });
});
