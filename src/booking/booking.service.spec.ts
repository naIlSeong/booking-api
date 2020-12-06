import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Place } from 'src/place/entity/place.entity';
import { Team } from 'src/team/entity/team.entity';
import { User } from 'src/user/entity/user.entity';
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
  it.todo('createBooking');
  it.todo('bookingDetail');
  it.todo('getBookings');
  it.todo('registerParticipant');
  it.todo('deleteBooking');
  it.todo('editBooking');
  it.todo('createInUse');
  it.todo('checkInUse');
  it.todo('extendInUse');
  it.todo('finishInUse');
});
