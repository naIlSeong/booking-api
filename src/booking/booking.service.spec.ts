import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Place } from 'src/place/entity/place.entity';
import { Team } from 'src/team/entity/team.entity';
import { User, UserRole } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { BookingService } from './booking.service';
import { Booking } from './entity/booking.entity';

const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockCreator = {
  id: 7,
  teamId: 9,
  role: UserRole.Representative,
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepo: MockRepository<Booking>;
  let userRepo: MockRepository<User>;
  let placeRepo: MockRepository<Place>;
  let teamRepo: MockRepository<Team>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Place),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Team),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepo = module.get(getRepositoryToken(Booking));
    userRepo = module.get(getRepositoryToken(User));
    placeRepo = module.get(getRepositoryToken(Place));
    teamRepo = module.get(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBooking', () => {
    const createBookingArgs = {
      startAt: new Date('2020-12-25T13:00'),
      endAt: new Date('2020-12-25T15:00'),
      placeId: 1,
      withTeam: true,
    };

    it('Error: Place not found', async () => {
      placeRepo.findOne.mockResolvedValue(null);
      const result = await service.createBooking(
        createBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Place not found',
      });
    });

    it('Error: Place not available', async () => {
      placeRepo.findOne.mockResolvedValueOnce({
        id: createBookingArgs.placeId,
        isAvailable: false,
      });
      const result = await service.createBooking(
        createBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Place not available',
      });
    });

    it('Error: Already booking exist', async () => {
      placeRepo.findOne.mockResolvedValueOnce({
        id: createBookingArgs.placeId,
        isAvailable: true,
      });

      bookingRepo.find.mockResolvedValueOnce([]);
      bookingRepo.find.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      bookingRepo.find.mockResolvedValueOnce([{ id: 1 }]);

      const result = await service.createBooking(
        createBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Already booking exist',
      });
    });

    it('Error: Team not found', async () => {
      placeRepo.findOne.mockResolvedValueOnce({
        id: createBookingArgs.placeId,
        isAvailable: true,
      });

      bookingRepo.find.mockResolvedValue([]);
      userRepo.findOne.mockResolvedValueOnce({
        id: mockCreator.id,
        role: UserRole.Individual,
      });

      const result = await service.createBooking(
        createBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Team not found',
      });
    });

    it('Create new booking', async () => {
      placeRepo.findOne.mockResolvedValueOnce({
        id: createBookingArgs.placeId,
        isAvailable: true,
      });

      bookingRepo.find.mockResolvedValueOnce([]);
      bookingRepo.find.mockResolvedValueOnce([{ id: 2 }]);
      bookingRepo.find.mockResolvedValueOnce([{ id: 1 }]);

      bookingRepo.create.mockReturnValue({
        creatorId: mockCreator.id,
        place: { id: createBookingArgs.placeId },
        startAt: createBookingArgs.startAt,
        endAt: createBookingArgs.endAt,
      });

      userRepo.findOne.mockResolvedValueOnce(mockCreator);
      teamRepo.findOne.mockResolvedValue({ id: mockCreator.teamId });

      const result = await service.createBooking(
        createBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: true,
      });
      expect(bookingRepo.save).toBeCalledWith({
        creatorId: mockCreator.id,
        place: { id: createBookingArgs.placeId },
        startAt: createBookingArgs.startAt,
        endAt: createBookingArgs.endAt,
        team: { id: mockCreator.teamId },
      });
    });

    it('Error: Unexpected Error', async () => {
      placeRepo.findOne.mockRejectedValue(new Error());

      const result = await service.createBooking(
        createBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('bookingDetail', () => {
    const bookingDetailArgs = {
      bookingId: 1,
    };

    it('Error: Booking not found', async () => {
      bookingRepo.findOne.mockResolvedValue(null);
      const result = await service.bookingDetail(bookingDetailArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Booking not found',
      });
    });

    it('Find booking', async () => {
      bookingRepo.findOne.mockResolvedValueOnce({
        id: bookingDetailArgs.bookingId,
        creatorId: mockCreator.id,
      });
      userRepo.findOne.mockResolvedValueOnce({
        id: mockCreator.id,
      });
      const result = await service.bookingDetail(bookingDetailArgs);
      expect(result).toEqual({
        ok: true,
        booking: { id: bookingDetailArgs.bookingId, creatorId: mockCreator.id },
        creator: { id: mockCreator.id },
      });
    });

    it('Error: Unexpected Error', async () => {
      bookingRepo.findOne.mockRejectedValue(new Error());
      const result = await service.bookingDetail(bookingDetailArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('deleteBooking', () => {
    const deleteBookingArgs = {
      bookingId: 1,
    };

    it('Booking not found', async () => {
      bookingRepo.findOne.mockResolvedValue(null);
      const result = await service.deleteBooking(
        deleteBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Booking not found',
      });
    });

    it("You can't do this", async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: deleteBookingArgs.bookingId,
        creatorId: 999,
      });
      const result = await service.deleteBooking(
        deleteBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: false,
        error: "You can't do this",
      });
    });

    it('Delete one booking', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: deleteBookingArgs.bookingId,
        creatorId: mockCreator.id,
      });
      const result = await service.deleteBooking(
        deleteBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: true,
      });
      expect(bookingRepo.delete).toBeCalled();
    });

    it('Unexpected Error', async () => {
      bookingRepo.findOne.mockRejectedValue(new Error());
      const result = await service.deleteBooking(
        deleteBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('editBooking', () => {
    const editBookingArgs = {
      placeId: 1,
      bookingId: 2,
      startAt: new Date('2020-12-25T14:00'),
      endAt: new Date('2020-12-25T16:00'),
    };

    const otherEditBookingArgs = {
      placeId: 1,
      bookingId: 2,
    };

    it('Error: Booking not found', async () => {
      bookingRepo.findOne.mockResolvedValue(null);
      const result = await service.editBooking(editBookingArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Booking not found',
      });
    });

    it("Error: You can't do this", async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: editBookingArgs.bookingId,
        creatorId: 999,
      });
      const result = await service.editBooking(editBookingArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: "You can't do this",
      });
    });

    it("Error: You can't do this in use", async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: editBookingArgs.bookingId,
        creatorId: mockCreator.id,
        inUse: true,
      });
      const result = await service.editBooking(editBookingArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: "You can't do this in use",
      });
    });

    it('Error: Place not found', async () => {
      bookingRepo.findOne.mockResolvedValueOnce({
        id: editBookingArgs.bookingId,
        creatorId: mockCreator.id,
        inUse: false,
      });
      placeRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.editBooking(editBookingArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Place not found',
      });
    });

    it('Error: Place not available', async () => {
      bookingRepo.findOne.mockResolvedValueOnce({
        id: editBookingArgs.bookingId,
        creatorId: mockCreator.id,
        inUse: false,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: editBookingArgs.placeId,
        isAvailable: false,
      });

      const result = await service.editBooking(editBookingArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Place not available',
      });
    });

    it('Error: Already booking exist', async () => {
      bookingRepo.findOne.mockResolvedValueOnce({
        id: editBookingArgs.bookingId,
        creatorId: mockCreator.id,
        inUse: false,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: editBookingArgs.placeId,
        isAvailable: true,
      });

      bookingRepo.find.mockResolvedValueOnce([{ id: 999 }]);
      bookingRepo.find.mockResolvedValueOnce([{ id: 998 }]);
      bookingRepo.find.mockResolvedValueOnce([{ id: 997 }]);

      const result = await service.editBooking(editBookingArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Already booking exist',
      });
    });

    it('Success to edit booking', async () => {
      bookingRepo.findOne.mockResolvedValueOnce({
        id: editBookingArgs.bookingId,
        creatorId: mockCreator.id,
        inUse: false,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: editBookingArgs.placeId,
        isAvailable: true,
      });

      bookingRepo.find.mockResolvedValueOnce([]);
      bookingRepo.find.mockResolvedValueOnce([
        { id: editBookingArgs.bookingId },
      ]);
      bookingRepo.find.mockResolvedValueOnce([
        { id: editBookingArgs.bookingId },
        { id: 999 },
        { id: 777 },
      ]);

      const result = await service.editBooking(
        {
          placeId: editBookingArgs.placeId,
          bookingId: editBookingArgs.bookingId,
        },
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: true,
      });
    });

    it('Error: Unexpected Error', async () => {
      bookingRepo.findOne.mockRejectedValue(new Error());
      const result = await service.editBooking(editBookingArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('createInUse', () => {
    const createInUseArgs = {
      placeId: 1,
      withTeam: true,
    };

    it('Error: Place not found', async () => {
      placeRepo.findOne.mockResolvedValue(null);

      const result = await service.createInUse(createInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Place not found',
      });
    });

    it('Error: Place not available', async () => {
      placeRepo.findOne.mockResolvedValue({
        id: createInUseArgs.placeId,
        isAvailable: false,
      });

      const result = await service.createInUse(createInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Place not available',
      });
    });

    it('Error: Already booking exist', async () => {
      placeRepo.findOne.mockResolvedValue({
        id: createInUseArgs.placeId,
        isAvailable: true,
      });

      bookingRepo.find.mockResolvedValueOnce([{ id: 999 }]);
      bookingRepo.find.mockResolvedValueOnce([]);
      bookingRepo.find.mockResolvedValueOnce([]);

      const result = await service.createInUse(createInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Already booking exist',
      });
    });

    it('Error: Team not found', async () => {
      placeRepo.findOne.mockResolvedValueOnce({
        id: createInUseArgs.placeId,
        isAvailable: true,
      });

      bookingRepo.find.mockResolvedValueOnce([]);
      bookingRepo.find.mockResolvedValueOnce([{ id: 999 }]);
      bookingRepo.find.mockResolvedValueOnce([{ id: 888 }]);

      bookingRepo.create.mockReturnValue({
        id: 1,
      });
      userRepo.findOne.mockResolvedValueOnce({
        id: mockCreator.id,
        teamId: null,
      });

      const result = await service.createInUse(createInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Team not found',
      });
    });

    it('Success to create inUse', async () => {
      placeRepo.findOne.mockResolvedValueOnce({
        id: createInUseArgs.placeId,
        isAvailable: true,
      });

      bookingRepo.find.mockResolvedValueOnce([]);
      bookingRepo.find.mockResolvedValueOnce([]);
      bookingRepo.find.mockResolvedValueOnce([]);

      bookingRepo.create.mockReturnValue({
        id: 1,
      });
      userRepo.findOne.mockResolvedValueOnce({
        id: mockCreator.id,
        teamId: 1,
      });
      teamRepo.findOne.mockResolvedValueOnce({ id: 1 });

      const result = await service.createInUse(createInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: true,
      });
      expect(bookingRepo.create).toBeCalled();
      expect(bookingRepo.save).toBeCalled();
    });

    it('Error: Unexpected Error', async () => {
      placeRepo.findOne.mockRejectedValue(new Error());
      const result = await service.createInUse(createInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('extendInUse', () => {
    const extendInUseArgs = {
      bookingId: 5,
    };

    it('Error: Booking not found', async () => {
      bookingRepo.findOne.mockResolvedValue(null);

      const result = await service.extendInUse(extendInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Booking not found',
      });
    });

    it("Error: You can't do this", async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: extendInUseArgs.bookingId,
        creatorId: 78,
      });

      const result = await service.extendInUse(extendInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: "You can't do this",
      });
    });

    it('Error: Already finished', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: extendInUseArgs.bookingId,
        creatorId: mockCreator.id,
        isFinished: true,
      });

      const result = await service.extendInUse(extendInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Already finished',
      });
    });

    it('Error: Not in use', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: extendInUseArgs.bookingId,
        creatorId: mockCreator.id,
        isFinished: false,
        inUse: false,
      });

      const result = await service.extendInUse(extendInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Not in use',
      });
    });

    it("Error: Can't extend now", async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: extendInUseArgs.bookingId,
        creatorId: mockCreator.id,
        isFinished: false,
        inUse: true,
        canExtend: false,
        endAt: new Date(new Date().valueOf() + 1800000),
      });

      const result = await service.extendInUse(extendInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: "Can't extend now",
      });
    });

    it('Extend 30minutes', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: extendInUseArgs.bookingId,
        creatorId: mockCreator.id,
        isFinished: false,
        inUse: true,
        endAt: new Date(new Date().valueOf() + 300000),
      });

      const result = await service.extendInUse(extendInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: true,
      });
      expect(bookingRepo.save).toBeCalled();
    });

    it('Error: Unexpected Error', async () => {
      bookingRepo.findOne.mockRejectedValue(new Error());
      const result = await service.extendInUse(extendInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('finishInUse', () => {
    const finishInUseArgs = {
      bookingId: 11,
    };

    it('Error: Booking not found', async () => {
      bookingRepo.findOne.mockResolvedValue(null);

      const result = await service.finishInUse(finishInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Booking not found',
      });
    });

    it("Error: You can't do this", async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: finishInUseArgs.bookingId,
        creatorId: 67,
      });

      const result = await service.finishInUse(finishInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: "You can't do this",
      });
    });

    it('Error: Already finished', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: finishInUseArgs.bookingId,
        creatorId: mockCreator.id,
        isFinished: true,
      });

      const result = await service.finishInUse(finishInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Already finished',
      });
    });

    it('Error: Not in use', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: finishInUseArgs.bookingId,
        creatorId: mockCreator.id,
        isFinished: false,
        inUse: false,
      });

      const result = await service.finishInUse(finishInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Not in use',
      });
    });

    it('Finish inUse (booking)', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: finishInUseArgs.bookingId,
        creatorId: mockCreator.id,
        isFinished: false,
        inUse: true,
      });

      const result = await service.finishInUse(finishInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: true,
      });
      expect(bookingRepo.save).toBeCalled();
    });

    it('Error: Unexpected Error', async () => {
      bookingRepo.findOne.mockRejectedValue(new Error());
      const result = await service.finishInUse(finishInUseArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('checkInUse', () => {
    it('checkInUse', async () => {
      bookingRepo.find.mockResolvedValueOnce([
        { id: 1, inUse: false, isFinished: false },
      ]);
      bookingRepo.find.mockResolvedValueOnce([
        { id: 2, inUse: true, isFinished: false },
      ]);

      await service.checkInUse();
      expect(bookingRepo.save).toBeCalled();
    });

    it('Catch Error', async () => {
      bookingRepo.find.mockRejectedValue(new Error());
      try {
        await service.checkInUse();
      } catch (e) {
        expect(e).toEqual({
          error: 'Fail to check',
        });
      }
    });
  });

  describe('editBookingForTest', () => {
    const mockBookingId = 98;

    it('Advance 55minutes', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: mockBookingId,
        startAt: new Date(),
        endAt: new Date(new Date().valueOf() + 1800000),
      });

      const result = await service.editBookingForTest(mockBookingId);
      expect(result).toEqual({
        ok: true,
      });
      expect(bookingRepo.save).toBeCalled();
    });

    it('Error: Unexpected Error', async () => {
      bookingRepo.findOne.mockRejectedValue(new Error());
      const result = await service.editBookingForTest(mockBookingId);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });
});
