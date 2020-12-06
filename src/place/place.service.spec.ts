import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceLocation } from './entity/location.entity';
import { Place } from './entity/place.entity';
import { PlaceService } from './place.service';

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PlaceService', () => {
  let service: PlaceService;
  let placeRepo: MockRepository<Place>;
  let locationRepo: MockRepository<PlaceLocation>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PlaceService,
        {
          provide: getRepositoryToken(Place),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(PlaceLocation),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlaceService>(PlaceService);
    placeRepo = module.get(getRepositoryToken(Place));
    locationRepo = module.get(getRepositoryToken(PlaceLocation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPlace', () => {
    it.todo('should fail if location not found');
    it.todo('should fail if already place exist');
    it.todo('should create a place');
    it.todo('should fail on exception');
  });

  describe('toggleIsAvailable', () => {
    it.todo('should fail if place not found');
    it.todo('should success to toggle isAvailable');
    it.todo('should fail on exception');
  });

  describe('editPlace', () => {
    it.todo('should fail if location not found');
    it.todo('should fail if place not found');
    it.todo('should success to edit place');
    it.todo('should fail on exception');
  });

  describe('deletePlace', () => {
    it.todo('should fail if location not found');
    it.todo('should fail if place not found');
    it.todo('should fail place in use');
    it.todo('should fail place is available');
    it.todo('should success to delete a place');
    it.todo('should fail on exception');
  });

  describe('placeDetail', () => {
    it.todo('should fail if place not found');
    it.todo('should success to find a place');
    it.todo('should fail on exception');
  });

  describe('createLocation', () => {
    it.todo('should fail if already location exist');
    it.todo('should success to create a location');
    it.todo('should fail on exception');
  });

  describe('locationDetail', () => {
    it.todo('should fail if location not found');
    it.todo('should success to find a location');
    it.todo('should fail on exception');
  });
});
