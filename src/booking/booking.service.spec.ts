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

  it.todo('checkSchedule');
  it.todo('isMyBooking');

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

  it.todo('bookingDetail');
  it.todo('getBookings');
  it.todo('deleteBooking');
  it.todo('editBooking');
  it.todo('createInUse');
  it.todo('checkInUse');
  it.todo('extendInUse');
  it.todo('finishInUse');
  it.todo('editBookingForTest');
});
