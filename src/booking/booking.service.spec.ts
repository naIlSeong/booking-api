import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { async } from 'rxjs';
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

  it('checkSchedule', async () => {
    let place: Place;
    bookingRepo.find.mockResolvedValueOnce([{ id: 6 }]);
    bookingRepo.find.mockResolvedValueOnce([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ]);
    bookingRepo.find.mockResolvedValueOnce([{ id: 1 }, { id: 3 }]);

    const { startEarlyOrEqual, startInMiddle } = await service.checkSchedule(
      place,
      new Date('2020-12-25T01:00'),
      new Date('2020-12-25T02:00'),
    );
    expect(startEarlyOrEqual.length).toEqual(1);
    expect(startInMiddle.length).toEqual(2);
    expect(startInMiddle).toEqual([{ id: 1 }, { id: 3 }]);
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
      bookingRepo.findOne.mockResolvedValue({
        id: bookingDetailArgs.bookingId,
      });
      const result = await service.bookingDetail(bookingDetailArgs);
      expect(result).toEqual({
        ok: true,
        booking: { id: bookingDetailArgs.bookingId },
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

  describe('getBookings', () => {
    it("Find creator's bookings", async () => {
      bookingRepo.find.mockResolvedValue([
        { id: 1, creatorId: mockCreator.id },
        { id: 2, creatorId: mockCreator.id },
      ]);
      const result = await service.getBookings(mockCreator.id);
      expect(result.ok).toEqual(true);
      expect(result.bookings.length).toEqual(2);
    });

    it('Error: Unexpected Error', async () => {
      bookingRepo.find.mockRejectedValue(new Error());
      const result = await service.getBookings(mockCreator.id);
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

    it('Booking not found', async () => {
      bookingRepo.findOne.mockResolvedValue(null);
      const result = await service.editBooking(editBookingArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Booking not found',
      });
    });

    it("You can't do this", async () => {
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

    it("You can't do this in use", async () => {
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

    it('Place not found', async () => {
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

    it('Place not available', async () => {
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

    it('Already booking exist', async () => {
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

      const result = await service.editBooking(editBookingArgs, mockCreator.id);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('Success to edit booking only place', async () => {
      bookingRepo.findOne.mockResolvedValueOnce({
        id: otherEditBookingArgs.bookingId,
        creatorId: mockCreator.id,
        inUse: false,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: otherEditBookingArgs.placeId,
        isAvailable: true,
      });

      bookingRepo.find.mockResolvedValueOnce([]);
      bookingRepo.find.mockResolvedValueOnce([
        { id: otherEditBookingArgs.bookingId },
      ]);
      bookingRepo.find.mockResolvedValueOnce([
        { id: otherEditBookingArgs.bookingId },
        { id: 999 },
        { id: 777 },
      ]);

      const result = await service.editBooking(
        otherEditBookingArgs,
        mockCreator.id,
      );
      expect(result).toEqual({
        ok: true,
      });
    });

    it('Unexpected Error', async () => {
      bookingRepo.findOne.mockRejectedValue(new Error());
      const result = await service.editBooking(editBookingArgs, mockCreator.id);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  it.todo('createInUse');
  it.todo('checkInUse');
  it.todo('extendInUse');
  it.todo('finishInUse');
  it.todo('editBookingForTest');
});
